<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\AudienceGroupsRequest;
use App\Http\Requests\Client\AudienceUpsertRequest;
use App\Models\User;
use App\Models\UserGroup;
use App\Response\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;
use Illuminate\Validation\Rule;

class ExternalController extends Controller
{
    public function rooms(Request $request, User $actor)
    {
        if (! $this->isValidActor($actor)) {
            return ApiResponse::unAuthorized();
        }

        return ApiResponse::success(
            $actor->manageable()
                ->select(['live_rooms.id', 'live_rooms.name', 'live_rooms.description', 'live_rooms.cover'])
                ->get()
        );
    }

    public function groups(Request $request, User $actor)
    {
        if (! $this->isValidActor($actor)) {
            return ApiResponse::unAuthorized();
        }

        return ApiResponse::success(
            UserGroup::query()
                ->canViewBy($actor)
                ->with('rooms')
                ->get()
        );
    }

    public function audiences(Request $request)
    {
        return ApiResponse::success(
            User::query()
                ->where('role', 'audience')
                ->with('groups')
                ->orderBy('created_at')
                ->orderBy('id')
                ->get(['id', 'name', 'phone', 'email'])
                ->map(fn (User $audience) => $this->audienceListResponse($audience))
                ->values()
        );
    }

    public function upsertAudience(AudienceUpsertRequest $request, User $actor)
    {
        if (! $this->isValidActor($actor)) {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $this->normalizeIds($request->validated('group_ids'));

        if (! $this->canManageGroups($actor, $groupIds)) {
            return ApiResponse::unAuthorized();
        }

        $audience = $this->resolveAudienceByIdentity($request);

        if ($audience instanceof MessageBag) {
            return ApiResponse::error('提交的数据验证失败', 4003, $audience->toArray());
        }

        $uniqueErrors = $this->validateAudienceUniqueFields($request, $audience);
        if ($uniqueErrors) {
            return ApiResponse::error('提交的数据验证失败', 4003, $uniqueErrors);
        }

        if ($audience && $audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        $plainPassword = null;

        if (! $audience) {
            $plainPassword = $this->generatePassword();
            $audience = new User([
                'role' => 'audience',
                'account_type' => 'human',
                'password' => $plainPassword,
            ]);
        }

        $audience->fill($request->only(['name', 'phone', 'email']));
        $audience->save();
        $audience->groups()->syncWithoutDetaching($groupIds);
        $this->forgetRoomAudienceCache($groupIds);

        return ApiResponse::success($this->audienceResponse($audience, $plainPassword));
    }

    public function attachAudienceGroups(AudienceGroupsRequest $request, User $actor, User $audience)
    {
        if (! $this->isValidActor($actor) || $audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $this->normalizeIds($request->validated('group_ids'));

        if (! $this->canManageGroups($actor, $groupIds)) {
            return ApiResponse::unAuthorized();
        }

        $audience->groups()->syncWithoutDetaching($groupIds);
        $this->forgetRoomAudienceCache($groupIds);

        return ApiResponse::success($this->audienceResponse($audience));
    }

    public function detachAudienceGroups(AudienceGroupsRequest $request, User $actor, User $audience)
    {
        if (! $this->isValidActor($actor) || $audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $this->normalizeIds($request->validated('group_ids'));

        if (! $this->canManageGroups($actor, $groupIds)) {
            return ApiResponse::unAuthorized();
        }

        $audience->groups()->detach($groupIds);
        $this->forgetRoomAudienceCache($groupIds);

        return ApiResponse::success($this->audienceResponse($audience));
    }

    private function isValidActor(User $actor): bool
    {
        return $actor->account_type === 'service'
            && $actor->role === 'room-admin';
    }

    /**
     * @param  array<int, string>  $groupIds
     */
    private function canManageGroups(User $actor, array $groupIds): bool
    {
        $manageableGroupIds = $this->actorManageableGroupIds($actor);

        return empty(array_diff($groupIds, $manageableGroupIds));
    }

    /**
     * @return array<int, string>
     */
    private function actorManageableGroupIds(User $actor): array
    {
        return $actor->manageable_groups
            ->map(fn ($id) => (string) $id)
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @param  array<int, mixed>  $ids
     * @return array<int, string>
     */
    private function normalizeIds(array $ids): array
    {
        return array_values(array_unique(array_map('strval', $ids)));
    }

    /**
     * @param  array<int, string>  $groupIds
     */
    private function forgetRoomAudienceCache(array $groupIds): void
    {
        UserGroup::query()
            ->whereIn('id', $groupIds)
            ->with('rooms')
            ->get()
            ->each(function (UserGroup $group) {
                $group->rooms->each(fn ($room) => Cache::forget("room-audiences-$room->id"));
            });
    }

    private function audienceResponse(User $audience, ?string $plainPassword = null): array
    {
        $response = [
            'id' => $audience->id,
            'user_id' => $audience->id,
            'name' => $audience->name,
            'phone' => $audience->phone,
            'email' => $audience->email,
            'group_ids' => $audience->groups()
                ->pluck('user_groups.id')
                ->map(fn ($id) => (string) $id)
                ->values()
                ->all(),
        ];

        if ($plainPassword) {
            $response['password'] = $plainPassword;
        }

        return $response;
    }

    private function audienceListResponse(User $audience): array
    {
        return [
            'id' => $audience->id,
            'name' => $audience->name,
            'phone' => $audience->phone,
            'email' => $audience->email,
            'group_ids' => $audience->groups
                ->pluck('id')
                ->map(fn ($id) => (string) $id)
                ->values()
                ->all(),
        ];
    }

    private function generatePassword(): string
    {
        $groups = [
            'ABCDEFGHJKLMNPQRSTUVWXYZ',
            'abcdefghijkmnopqrstuvwxyz',
            '23456789',
            '!@#$%^&*',
        ];

        $characters = implode('', $groups);
        $password = [];

        foreach ($groups as $group) {
            $password[] = $group[random_int(0, strlen($group) - 1)];
        }

        while (count($password) < 16) {
            $password[] = $characters[random_int(0, strlen($characters) - 1)];
        }

        for ($i = count($password) - 1; $i > 0; $i--) {
            $j = random_int(0, $i);
            [$password[$i], $password[$j]] = [$password[$j], $password[$i]];
        }

        return implode('', $password);
    }

    private function validateAudienceUniqueFields(AudienceUpsertRequest $request, ?User $audience): ?array
    {
        $validator = Validator::make($request->only(['name', 'phone', 'email']), [
            'name' => ['required', 'string', Rule::unique('users')->ignore($audience)],
            'phone' => ['nullable', 'string', Rule::unique('users')->ignore($audience)],
            'email' => ['nullable', 'email', Rule::unique('users')->ignore($audience)],
        ], [], [
            'name' => '姓名',
            'phone' => '手机号',
            'email' => '电子邮件',
        ]);

        return $validator->fails() ? $validator->errors()->toArray() : null;
    }

    private function resolveAudienceByIdentity(AudienceUpsertRequest $request): User|MessageBag|null
    {
        $identities = collect($request->only(['name', 'phone', 'email']))
            ->filter(fn ($value) => filled($value));

        $users = User::query()
            ->where(function ($query) use ($identities) {
                $identities->each(fn ($value, $field) => $query->orWhere($field, $value));
            })
            ->get();

        if ($users->isEmpty()) {
            return null;
        }

        if ($users->pluck('id')->unique()->count() > 1) {
            return Validator::make([], [])->errors()->add(
                'identity',
                '姓名、手机号或电子邮件匹配到多个用户，请检查提交的数据'
            );
        }

        return $users->first();
    }
}

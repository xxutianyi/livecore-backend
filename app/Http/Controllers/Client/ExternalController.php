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

    public function upsertAudience(AudienceUpsertRequest $request, User $actor)
    {
        if (! $this->isValidActor($actor)) {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $this->normalizeIds($request->validated('group_ids'));

        if (! $this->canManageGroups($actor, $groupIds)) {
            return ApiResponse::unAuthorized();
        }

        $audience = User::query()
            ->where('external_id', $request->validated('external_id'))
            ->first();

        $uniqueErrors = $this->validateAudienceUniqueFields($request, $audience);
        if ($uniqueErrors) {
            return ApiResponse::error('提交的数据验证失败', 4003, $uniqueErrors);
        }

        if ($audience && $audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        if (! $audience) {
            $audience = new User([
                'external_id' => $request->validated('external_id'),
                'role' => 'audience',
                'account_type' => 'human',
            ]);
        }

        $audience->fill($request->only(['name', 'phone', 'email']));
        $audience->save();
        $audience->groups()->syncWithoutDetaching($groupIds);
        $this->forgetRoomAudienceCache($groupIds);

        return ApiResponse::success($this->audienceResponse($audience, $groupIds));
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

        return ApiResponse::success($this->audienceResponse($audience, $groupIds));
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

        return ApiResponse::success($this->audienceResponse($audience, $groupIds));
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
        $manageableGroupIds = $actor->manageable_groups
            ->map(fn ($id) => (string) $id)
            ->all();

        return empty(array_diff($groupIds, $manageableGroupIds));
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

    /**
     * @param  array<int, string>  $groupIds
     */
    private function audienceResponse(User $audience, array $groupIds): array
    {
        return [
            'id' => $audience->id,
            'external_id' => $audience->external_id,
            'name' => $audience->name,
            'phone' => $audience->phone,
            'email' => $audience->email,
            'group_ids' => $groupIds,
        ];
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
}

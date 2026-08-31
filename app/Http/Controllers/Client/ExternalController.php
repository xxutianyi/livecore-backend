<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\AudienceGroupsRequest;
use App\Http\Requests\Client\AudienceCreateRequest;
use App\Http\Requests\Client\AudienceUpsertRequest;
use App\Models\Live\LiveMessage;
use App\Models\Live\LiveRoom;
use App\Models\Online\UserOnline;
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
    private const AUDIENCE_LIST_CACHE_KEY = 'client-audiences';

    private const RESET_AUDIENCE_PASSWORD = 'Password!@';

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
        $request->validate([
            'online' => ['nullable', 'in:true,false,1,0'],
        ]);

        $online = $request->filled('online') ? $request->boolean('online') : null;

        return ApiResponse::success(
            Cache::remember(
                $this->audienceListCacheKey($online),
                now()->addMinute(),
                fn () => $this->audienceList($online),
            )
        );
    }

    public function audienceRooms(Request $request, User $audience)
    {
        if ($audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $audience->groups()
            ->pluck('user_groups.id')
            ->map(fn ($id) => (string) $id)
            ->all();

        return ApiResponse::success(
            LiveRoom::query()
                ->select(['live_rooms.id', 'live_rooms.name', 'live_rooms.description', 'live_rooms.cover'])
                ->whereHas('groups', fn ($query) => $query->whereIn('user_groups.id', $groupIds))
                ->orderBy('created_at')
                ->orderBy('id')
                ->get()
        );
    }

    public function resetAudiencePassword(Request $request, User $audience)
    {
        if ($audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        $plainPassword = self::RESET_AUDIENCE_PASSWORD;
        $audience->forceFill(['password' => $plainPassword])->save();

        return ApiResponse::success($this->audienceResponse($audience, $plainPassword));
    }

    public function viewingRecords(Request $request, User $audience)
    {
        if ($audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        return ApiResponse::success(
            UserOnline::query()
                ->where('user_id', $audience->id)
                ->with(['room', 'event'])
                ->latest('joined_at')
                ->latest('id')
                ->get()
        );
    }

    public function commentRecords(Request $request, User $audience)
    {
        if ($audience->role !== 'audience') {
            return ApiResponse::unAuthorized();
        }

        return ApiResponse::success(
            LiveMessage::query()
                ->where('sender_id', $audience->id)
                ->select([
                    'id',
                    'content',
                    'room_id',
                    'event_id',
                    'sender_id',
                    'reviewer_id',
                    'reviewed_at',
                    'created_at',
                ])
                ->without('sender')
                ->with(['room', 'event', 'reviewer'])
                ->latest('created_at')
                ->latest('id')
                ->get()
                ->each(fn (LiveMessage $message) => $message->setAttribute(
                    'review_status',
                    $message->reviewed_at ? 'reviewed' : 'pending',
                ))
        );
    }

    public function createAudience(AudienceCreateRequest $request, User $actor)
    {
        if (! $this->isValidActor($actor)) {
            return ApiResponse::unAuthorized();
        }

        $groupIds = $this->normalizeIds($request->validated('group_ids'));

        if (! $this->canManageGroups($actor, $groupIds)) {
            return ApiResponse::unAuthorized();
        }

        $uniqueErrors = $this->validateAudienceUniqueFields($request);
        if ($uniqueErrors) {
            return ApiResponse::error('提交的数据验证失败', 4003, $uniqueErrors);
        }

        $plainPassword = self::RESET_AUDIENCE_PASSWORD;
        $audience = new User([
            'role' => 'audience',
            'account_type' => 'human',
            'password' => $plainPassword,
        ]);

        $audience->fill($request->only(['name', 'phone', 'email']));
        $audience->save();
        $audience->groups()->syncWithoutDetaching($groupIds);
        $this->forgetRoomAudienceCache($groupIds);
        $this->forgetAudienceListCache();

        return ApiResponse::success($this->audienceResponse($audience, $plainPassword));
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
            $plainPassword = self::RESET_AUDIENCE_PASSWORD;
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
        $this->forgetAudienceListCache();

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
        $this->forgetAudienceListCache();

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
        $this->forgetAudienceListCache();

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

    private function forgetAudienceListCache(): void
    {
        foreach ([null, true, false] as $online) {
            Cache::forget($this->audienceListCacheKey($online));
        }
    }

    private function audienceListCacheKey(?bool $online): string
    {
        return match ($online) {
            true => self::AUDIENCE_LIST_CACHE_KEY.':online',
            false => self::AUDIENCE_LIST_CACHE_KEY.':offline',
            default => self::AUDIENCE_LIST_CACHE_KEY,
        };
    }

    private function audienceList(?bool $online)
    {
        $query = User::query()
            ->where('role', 'audience')
            ->with('groups')
            ->withExists([
                'onlines as online_status' => fn ($query) => $query->whereNull('leaving_at'),
            ]);

        if ($online === true) {
            $query->whereHas('onlines', fn ($query) => $query->whereNull('leaving_at'));
        }

        if ($online === false) {
            $query->whereDoesntHave('onlines', fn ($query) => $query->whereNull('leaving_at'));
        }

        return $query
            ->orderBy('created_at')
            ->orderBy('id')
            ->get(['id', 'name', 'phone', 'email'])
            ->map(fn (User $audience) => $this->audienceListResponse($audience))
            ->values();
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
            'online' => (bool) $audience->online_status,
            'group_ids' => $audience->groups
                ->pluck('id')
                ->map(fn ($id) => (string) $id)
                ->values()
                ->all(),
        ];
    }

    private function validateAudienceUniqueFields(Request $request, ?User $audience = null): ?array
    {
        $validator = Validator::make($request->only(['name', 'phone', 'email']), [
            'name' => ['required', 'string', Rule::unique('users', 'name')->ignore($audience)],
            'phone' => ['nullable', 'string', Rule::unique('users', 'phone')->ignore($audience)],
            'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($audience)],
        ], [
            'name.unique' => '用户名已存在，请更换后重试。',
            'phone.unique' => '手机号已存在，请更换后重试。',
            'email.unique' => '电子邮件已存在，请更换后重试。',
        ], [
            'name' => '用户名',
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

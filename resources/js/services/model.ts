export interface Model<KeyType = string> extends Record<string, unknown> {
    id: KeyType;
    created_at: string;
    updated_at: string;
}

export interface SoftDeletes {
    deleted_at: string;
}

export interface WithChildren<T extends Model> {
    children?: T[];
}

export interface User extends Model {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    email_verified_at?: string;
    phone_verified_at?: string;
    authorities: string[];
    external_id?: string;
    inviter_code: string;
    invitation_code?: string;
    online?: boolean;
    leaving_at?: string;
}

export interface UserOnline extends Model {
    user_id: User['id'];
    joined_at?: string;
    leaving_at?: string;
    heartbeats?: UserHeartbeat[];
    heartbeats_count?: number;
}

export interface UserHeartbeat extends Model {
    meta: object;
    online?: UserOnline;
    online_id: UserOnline['id'];
}

export interface Team extends Model, WithChildren<Team> {
    name: string;
    path: string;
    parent_id: Team['id'];
}

export interface LiveRoom extends Model {
    name: string;
    slug: string;
    cover?: string;
    description?: string;
    manageable_users: User[];
    event?: LiveEvent;
}

export interface LiveEvent extends Model {
    name: string;
    cover?: string;
    description?: string;
    push_url?: string;
    pull_url?: string;
    playback_url?: string;
    live_started_at?: string;
    live_finished_at?: string;
    expires_at: string;
    room?: LiveRoom;
    room_id: LiveRoom['id'];
}

export interface LiveMessage extends Model {
    content: string;
    event?: LiveEvent;
    event_id: LiveEvent['id'];
    sender?: Pick<User, 'id' | 'name'>;
    reviewer?: Pick<User, 'id' | 'name'>;
    reviewed_at?: string;
}

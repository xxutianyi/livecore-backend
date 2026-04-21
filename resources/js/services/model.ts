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
    groups?: UserGroup[];
}

export interface UserOnline extends Model {
    user_id: User['id'];
    room?: LiveRoom;
    event?: LiveEvent;
    online?: UserOnline;
    living?: boolean;
    room_id: LiveRoom['id'];
    event_id: LiveEvent['id'];
    online_id: UserOnline['id'];
    joined_at?: string;
    leaving_at?: string;
}

export interface UserGroup extends Model, WithChildren<UserGroup> {
    name: string;
    path: string;
    users?: User;
    users_count?: number;
    children?: UserGroup[];
    parent_id?: UserGroup['id'];
}

export interface LiveRoom extends Model {
    name: string;
    slug: string;
    cover?: string;
    description?: string;
    manageable_users: User[];
    events?: LiveEvent[];
    events_count: number;
}

export interface LiveEvent extends Model {
    name: string;
    cover?: string;
    published?: boolean;
    description?: string;
    push_url: string;
    pull_url: string;
    expired_at?: string;
    started_at?: string;
    finished_at?: string;
    playback_url?: string;
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

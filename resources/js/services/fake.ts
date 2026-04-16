import { LiveEvent, LiveMessage, LiveRoom, User } from '@/services/model';
import { faker } from '@faker-js/faker/locale/zh_CN';

export function generate<T>(generator: () => T, count: number = 30): T[] {
    return Array.from({ length: count }, () => generator());
}

export function fakeUser(user?: Partial<User>): User {
    return {
        id: faker.string.uuid(),
        created_at: faker.date.recent().toString(),
        updated_at: faker.date.recent().toString(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        authorities: [],
        teams: [],
        ...user,
    };
}

export function fakeLiveRoom(room?: Partial<LiveRoom>): LiveRoom {
    return {
        id: faker.string.uuid(),
        created_at: faker.date.recent().toString(),
        updated_at: faker.date.recent().toString(),
        name: faker.person.lastName(),
        prefix: faker.string.alpha({ length: 8 }),
        cover: faker.image.urlPicsumPhotos(),
        living: faker.datatype.boolean(),
        manageable_users: [],
        ...room,
    };
}

export function fakeLiveEvent(rooms: LiveRoom[]): LiveEvent {
    const room = rooms[faker.number.int({ min: 0, max: rooms.length - 1 })];

    return {
        id: faker.string.uuid(),
        created_at: faker.date.recent().toString(),
        updated_at: faker.date.recent().toString(),
        name: faker.date.recent().toString(),
        expires_at: faker.date.future().toString(),
        cover: faker.image.urlPicsumPhotos(),
        room: room,
        room_id: room.id,
    };
}

export function fakeLiveComment(users: User[], events: LiveEvent[]): LiveMessage {
    const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
    const event = events[faker.number.int({ min: 0, max: events.length - 1 })];

    return {
        id: faker.string.uuid(),
        created_at: faker.date.recent().toString(),
        updated_at: faker.date.recent().toString(),
        content: faker.word.words(5),
        event_id: event.id,
        sender_id: user.id,
        sender_name: user.name,
    };
}

export const users = generate(fakeUser);
export const rooms = generate(fakeLiveRoom, 4);
export const events = generate(() => fakeLiveEvent(rooms));
export const comments = generate(() => fakeLiveComment(users, events), 500);

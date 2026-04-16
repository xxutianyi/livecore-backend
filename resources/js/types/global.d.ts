import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;

    interface WindowEventMap {
        'X-Request-Id': { detail: string };
    }
}

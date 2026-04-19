import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(data?: string) {
    if (!data) return '-';
    return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD');
}

export function formatTime(data?: string) {
    if (!data) return '-';
    return dayjs(data).tz('Asia/Shanghai').format('HH:mm:ss');
}

export function formatDatetime(data?: string) {
    if (!data) return '-';
    return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

export function diffDatetime(from?: string, to?: string) {
    if (!from || !to) return '-';

    const diff = dayjs(to).diff(from);
    const duration = dayjs.duration(diff);

    return duration.minutes() + '分钟';
}

export function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

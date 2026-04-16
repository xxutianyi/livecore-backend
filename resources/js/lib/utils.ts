import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(data?: string) {
    return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD');
}

export function formatTime(data?: string) {
    return dayjs(data).tz('Asia/Shanghai').format('HH:mm:ss');
}

export function formatDatetime(data?: string) {
    return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

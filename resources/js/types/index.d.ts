import { User } from '@/services/model';

export type SharedProps = {
    user?: User;
};

export type PaginateLink = {
    url: string;
    page: string;
    label: string;
    active: boolean;
};

export type PaginateData<T> = {
    data: T[];
    per_page: number;
    current_page: number;
    to: number;
    from: number;
    total: number;
    path: string;
    last_page: number;
    last_page_url: string;
    first_page_url: string;
    next_page_url?: string;
    prev_page_url?: string;
    links: PaginateLink[];
};

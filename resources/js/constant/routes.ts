import { HeartPulse, Lock, ShieldAlert, TvMinimal, TvMinimalPlay, Users } from 'lucide-react';
import { FunctionComponent } from 'react';

export type RouteItemGroup = {
    title: string;
    items?: {
        href?: string;
        external?: boolean;
        icon?: FunctionComponent;
        title: string;
        isActive?: boolean;
        children?: {
            href?: string;
            title: string;
            isActive?: boolean;
            external?: boolean;
        }[];
    }[];
};

export type Sets = 'admin' | 'broadcast';

const routes: Record<Sets, RouteItemGroup[]> = {
    admin: [
        {
            title: '直播配置',
            items: [
                {
                    title: '直播间',
                    icon: TvMinimal,
                    href: route('admin.live.rooms.index'),
                },
                {
                    title: '观众管理',
                    icon: Users,
                    href: route('admin.live.users.index'),
                },
            ],
        },
        {
            title: '系统配置',
            items: [
                {
                    title: '管理员',
                    icon: Lock,
                    href: route('admin.settings.users.index'),
                },
                {
                    title: '操作记录',
                    icon: ShieldAlert,
                },
            ],
        },
        {
            title: '系统监控',
            items: [
                {
                    title: 'Pulse',
                    icon: HeartPulse,
                    href: route('admin.monitor'),
                },
            ],
        },
        {
            title: '观众视角',
            items: [
                {
                    title: '直播前台',
                    icon: TvMinimalPlay,
                    href: route('rooms.index'),
                    external: true,
                },
            ],
        },
    ],
    broadcast: [],
};

export default routes;

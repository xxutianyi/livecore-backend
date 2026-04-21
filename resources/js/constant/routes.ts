import { ChartBar, HeartPulse, Lock, Play, ShieldAlert, TvMinimal, TvMinimalPlay, Users, Video } from 'lucide-react';
import { FunctionComponent } from 'react';

export type RouteItemGroup = {
    title: string;
    items?: {
        href?: string;
        external?: boolean;
        icon?: FunctionComponent;
        title: string;
        roles?: string[];
        isActive?: boolean;
        children?: {
            href?: string;
            title: string;
            roles?: string;
            isActive?: boolean;
            external?: boolean;
        }[];
    }[];
};

export type Sets = 'admin';

const routes: Record<Sets, RouteItemGroup[]> = {
    admin: [
        {
            title: '直播控制',
            items: [
                {
                    title: '开始直播',
                    icon: Play,
                    href: route('broadcast.direction'),
                    roles: ['admin', 'director'],
                },
                {
                    title: '直播回放',
                    icon: Video,
                    href: route('broadcast.playbacks'),
                    roles: ['admin', 'director'],
                },
                {
                    title: '观看数据',
                    icon: ChartBar,
                    href: route('broadcast.statistics'),
                    roles: ['admin', 'director'],
                },
            ],
        },
        {
            title: '观看设置',
            items: [
                {
                    title: '直播间',
                    icon: TvMinimal,
                    href: route('settings.rooms.index'),
                    roles: ['admin', 'director'],
                },
                {
                    title: '观众管理',
                    icon: Users,
                    href: route('settings.users.index'),
                    roles: ['admin'],
                },
            ],
        },
        {
            title: '系统配置',
            items: [
                {
                    title: '管理员',
                    icon: Lock,
                    href: route('systems.users.index'),
                    roles: ['admin'],
                },
                {
                    title: '操作记录',
                    icon: ShieldAlert,
                    roles: ['admin'],
                },
            ],
        },
        {
            title: '系统监控',
            items: [
                {
                    title: 'Pulse',
                    icon: HeartPulse,
                    href: route('monitor.pulse'),
                    roles: ['admin'],
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
};

export default routes;

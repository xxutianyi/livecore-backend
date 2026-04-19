import { ChartBar, HeartPulse, Lock, Play, ShieldAlert, TvMinimal, TvMinimalPlay, Users, Video } from 'lucide-react';
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
                },
                {
                    title: '直播回放',
                    icon: Video,
                    href: route('broadcast.playbacks'),
                },
                {
                    title: '观看数据',
                    icon: ChartBar,
                    href: route('broadcast.statistics'),
                },
            ],
        },
        {
            title: '观看设置',
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
};

export default routes;

import {
    Boxes,
    ChartArea,
    HeartPulse,
    Lock,
    Play,
    ShieldAlert,
    TvMinimal,
    TvMinimalPlay,
    Users,
    Video,
} from 'lucide-react';
import { FunctionComponent } from 'react';

export type GroupedMenuItem = {
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

export type GroupedMenuItemBreadcrumb = {
    link?: string;
    label: string;
};

export const menuItems: GroupedMenuItem[] = [
    {
        title: '直播间',
        items: [
            { title: '直播导播', icon: Play },
            { title: '回放管理', icon: Video },
            { title: '观看数据', icon: ChartArea },
        ],
    },
    {
        title: '直播配置',
        items: [
            { title: '直播间', icon: TvMinimal, href: '/console/live-room/rooms' },
            { title: '观众管理', icon: Users, href: '/console/live-room/users' },
            { title: '观众分组', icon: Boxes, href: '/console/live-room/groups' },
        ],
    },
    {
        title: '系统配置',
        items: [
            { title: '管理员', icon: Lock },
            { title: '操作记录', icon: ShieldAlert },
        ],
    },
    {
        title: '系统监控',
        items: [{ title: 'Pulse', icon: HeartPulse, href: '/pulse', external: true }],
    },
    {
        title: '观众视角',
        items: [{ title: '直播前台', icon: TvMinimalPlay, href: '/rooms' }],
    },
];

export function useGroupedMenuItems(): GroupedMenuItem[] {
    const pathname = window.location.pathname;

    function isActive(href?: string) {
        return (href && pathname === href) || pathname.startsWith(href + '/');
    }

    return menuItems.map((group) => ({
        ...group,
        items: group.items?.map((item) => {
            if (item.children && item.children.length > 0) {
                let hasActiveChild = false;

                const children = item.children.map((child) => {
                    const childActive = isActive(child.href);

                    if (childActive) {
                        hasActiveChild = true;
                    }

                    return { ...child, isActive: childActive };
                });

                return { ...item, children, isActive: hasActiveChild };
            }

            return { ...item, isActive: isActive(item.href) };
        }),
    }));
}

export function useGroupMenuItemBreadcrumb(): GroupedMenuItemBreadcrumb[] {
    const items = useGroupedMenuItems();
    const breadcrumb: GroupedMenuItemBreadcrumb[] = [];

    items.forEach((group) => {
        group.items?.map((item) => {
            if (item.isActive) {
                breadcrumb.push({ label: group.title });
                breadcrumb.push({ label: item.title, link: item.href });
            }

            if (item.children && item.children.length > 0) {
                item.children.forEach((child) => {
                    if (child.isActive) {
                        breadcrumb.push({ label: child.title, link: item.href });
                    }
                });
            }
        });
    });

    return breadcrumb;
}

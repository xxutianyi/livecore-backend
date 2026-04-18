'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDownIcon, LogOutIcon, Settings, User } from 'lucide-react';
import styles from '../admin.module.css';

export function AdminUserNav() {
    const { isMobile } = useSidebar();
    const { auth } = usePage<SharedProps>().props;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className={styles.avatar}>
                            <Avatar>
                                <AvatarFallback>
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{auth.user?.name}</span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <Settings />
                                账号设置
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href="/logout" method="post" as={DropdownMenuItem}>
                            <LogOutIcon />
                            退出账号
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

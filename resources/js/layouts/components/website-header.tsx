'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn, User } from 'lucide-react';

export function WebsiteUserAction() {
    const { auth } = usePage<SharedProps>().props;

    if (!auth.user) {
        return (
            <Button size="lg" asChild>
                <Link href="/login">
                    <LogIn />
                    <span>登录</span>
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="lg">
                    <User />
                    <span>{auth.user.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>设置</DropdownMenuItem>
                <Link href="/logout" method="post" as={DropdownMenuItem}>
                    退出
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

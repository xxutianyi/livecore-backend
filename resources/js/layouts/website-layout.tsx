import WingLab from '@/assets/WingLab/WingLab.svg?react';
import { ModeToggle, ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import useOnline from '@/hooks/use-online';
import { cn } from '@/lib/utils';
import { SharedProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { LogIn, User } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function UserDropdown() {
    const { user } = usePage<SharedProps>().props;

    if (!user) {
        return (
            <Button onClick={() => router.get('/login')}>
                <LogIn />
                登录
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <User />
                    {user.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.get('/profile')}>设置</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.post('/logout')}>退出</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function Header({ children, className }: PropsWithChildren<{ className?: string }>) {
    return (
        <nav
            className={cn(
                className,
                'flex h-16 w-full items-center justify-between border-t border-b px-4 py-4 md:px-8',
                'bg-neutral-50 dark:bg-neutral-900',
                'border-neutral-200 dark:border-neutral-800',
            )}
        >
            {children}
        </nav>
    );
}

export function Content({ children, className }: PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={cn(
                className,
                'h-[calc(100svh-64px)] overflow-x-scroll p-4 md:p-8',
                'bg-zinc-100 dark:bg-zinc-800',
            )}
        >
            {children}
        </div>
    );
}

export function WebsiteLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    useOnline();

    return (
        <ThemeProvider defaultTheme="system" storageKey="winglab-theme">
            <TooltipProvider>
                <Head>
                    <title>{title}</title>
                </Head>
                <Header>
                    <Link href={'/'}>
                        <div className="flex items-center gap-2">
                            <WingLab className="inline size-8 fill-primary" />
                            <h1 className="text-base font-bold md:text-xl">直播</h1>
                        </div>
                    </Link>
                    <div className="space-x-4">
                        <UserDropdown />
                        <ModeToggle />
                    </div>
                </Header>
                <Content>{children}</Content>
                <Toaster position="top-right" />
            </TooltipProvider>
        </ThemeProvider>
    );
}

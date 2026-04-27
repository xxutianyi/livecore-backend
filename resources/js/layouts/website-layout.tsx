'use client';

import { ThemeToggle } from '@/components/theme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import configs from '@/lib/configs';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn, User } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function UserAction() {
  const { auth } = usePage<SharedProps>().props;

  if (!auth || !auth.user) {
    return (
      <Button size="lg" asChild>
        <Link href="/login">
          <LogIn /> 登录
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg">
          <User />
          <span>{auth?.user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">设置</Link>
        </DropdownMenuItem>
        <Link href="/logout" method="post" as={DropdownMenuItem}>
          退出账号
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function WebsiteLayout({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <div className="flex h-16 w-full items-center justify-between border-t border-b border-border bg-sidebar px-4 py-4 md:px-8">
        <Link href="/">
          <div className="flex items-center gap-2">
            <img alt="logo" width={32} height={32} src={configs.APP_LOGO} className="inline" />
            <h1 className="text-base font-bold md:text-xl">{configs.APP_NAME}</h1>
          </div>
        </Link>
        <div className="space-x-4">
          <UserAction />
          <ThemeToggle />
        </div>
      </div>
      <ScrollArea className="h-[calc(100svh-64px)] overflow-hidden bg-muted/20 p-4 md:p-8">
        {children}
      </ScrollArea>
      <Toaster position="top-right" />
    </TooltipProvider>
  );
}

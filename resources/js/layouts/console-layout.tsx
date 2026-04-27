'use client';

import { SidebarMenu as SideMenu } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import routes from '@/constant/routes';
import { useRoutes } from '@/hooks/use-routes';
import configs from '@/lib/configs';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDownIcon, LogOutIcon, Settings, User } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function UserActions() {
  const { auth } = usePage<SharedProps>().props;
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
                <AvatarImage alt="avatar" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{auth?.user?.name}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} side={isMobile ? 'bottom' : 'right'}>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <Settings /> 账号设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/logout" method="post" as={DropdownMenuItem}>
              <LogOutIcon /> 退出账号
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function ConsoleLayout({ children }: PropsWithChildren) {
  const menuItems = useRoutes(routes);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-12 w-full items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                  <img alt="logo" src={configs.APP_ADMIN_LOGO} className="size-8 rounded-full" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{configs.APP_NAME}</span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SideMenu menu={menuItems} />
          </SidebarContent>
          <SidebarFooter>
            <UserActions />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="h-screen overflow-hidden">{children}</SidebarInset>
        <Toaster position="top-right" />
      </SidebarProvider>
    </TooltipProvider>
  );
}

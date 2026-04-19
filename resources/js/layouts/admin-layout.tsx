'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import routes, { Sets } from '@/constant/routes';
import { useRoutes } from '@/hooks/use-routes';
import { RootLayout } from '@/layouts/_root';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { AdminHeader } from './components/admin-header';
import { AdminSidebar } from './components/admin-sidebar';

type LayoutProps = PropsWithChildren<{
    title?: string;
    routesSets?: Sets;
    className?: string;
    breadcrumbTitle?: string;
}>;

export function AdminLayout({ children, title, routesSets = 'admin', className, breadcrumbTitle }: LayoutProps) {
    const menuItems = useRoutes(routes[routesSets]);

    return (
        <RootLayout>
            <Head>
                <title>{title}</title>
            </Head>
            <SidebarProvider>
                <AdminSidebar menu={menuItems} />
                <SidebarInset className="h-screen overflow-hidden">
                    <AdminHeader title={breadcrumbTitle} menu={menuItems} />
                    <ScrollArea className={cn(className, 'h-[calc(100vh-64px)] w-full p-4')}>{children}</ScrollArea>
                </SidebarInset>
            </SidebarProvider>
        </RootLayout>
    );
}

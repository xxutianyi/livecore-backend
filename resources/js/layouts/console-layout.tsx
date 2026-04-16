import { ConsoleHeader } from '@/components/console-header';
import { ConsoleSidebar } from '@/components/console-sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{ title?: string; breadcrumbTitle?: string; className?: string }>;

export function ConsoleLayout({ children, title, breadcrumbTitle, className }: LayoutProps) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="winglab-theme">
            <TooltipProvider>
                <Head>
                    <title>{title}</title>
                </Head>
                <SidebarProvider>
                    <ConsoleSidebar />
                    <SidebarInset className="h-screen overflow-hidden">
                        <ConsoleHeader title={breadcrumbTitle} />
                        <ScrollArea className={cn(className, 'h-[calc(100vh-64px)] w-full')}>{children}</ScrollArea>
                    </SidebarInset>
                </SidebarProvider>
                <Toaster position="top-right" />
            </TooltipProvider>
        </ThemeProvider>
    );
}

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';

export function RootLayout({ children }: PropsWithChildren) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="winglab-theme">
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-right" />
        </ThemeProvider>
    );
}

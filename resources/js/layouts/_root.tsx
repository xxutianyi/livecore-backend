import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';

export function RootLayout({ children }: PropsWithChildren) {
    return (
        <>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-right" />
        </>
    );
}

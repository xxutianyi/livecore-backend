'use client';

import { ThemeToggle } from '@/components/theme';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RootLayout } from '@/layouts/_root';
import { WebsiteUserAction } from '@/layouts/components/website-header';
import configs from '@/lib/configs';
import { Head, Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export function WebsiteLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <RootLayout>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex h-16 w-full items-center justify-between border-t border-b border-border bg-sidebar px-4 py-4 md:px-8">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <img alt="logo" src={configs.APP_LOGO} className="inline size-8 fill-primary" />
                        <h1 className="text-base font-bold md:text-xl">{configs.APP_NAME}</h1>
                    </div>
                </Link>
                <div className="space-x-4">
                    <WebsiteUserAction />
                    <ThemeToggle />
                </div>
            </div>
            <ScrollArea className="h-[calc(100svh-64px)] overflow-hidden bg-muted p-4 md:p-8">{children}</ScrollArea>
        </RootLayout>
    );
}

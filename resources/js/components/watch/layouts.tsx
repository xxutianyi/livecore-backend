import { Card } from '@/components/ui/card';
import { Video } from 'lucide-react';
import { PropsWithChildren } from 'react';

export function GridLayout({ children }: PropsWithChildren) {
    return <div className="grid gap-x-4 gap-y-8 md:grid-cols-4">{children}</div>;
}

export function WatchLayout({ children }: PropsWithChildren) {
    return <div className="max-md:-m-4 max-md:flex-col md:flex md:gap-x-4">{children}</div>;
}

export function PlayerCard({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <Card className="relative aspect-video p-0 max-md:rounded-none md:w-3/4">
            <div className="absolute top-4 left-5 z-10 flex items-center space-x-2 text-gray-50 max-md:hidden">
                <Video className="inline size-4" />
                <span className="font-heading text-base font-medium">{title}</span>
            </div>
            {children}
        </Card>
    );
}

export function RightContent({ children }: PropsWithChildren) {
    return (
        <Card className="relative max-md:h-[calc(100svh-64px-56.25vw)] max-md:rounded-none md:w-1/4">
            {children}
        </Card>
    );
}

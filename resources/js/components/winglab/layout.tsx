import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export function Space({ className, children }: PropsWithChildren<{ className?: string }>) {
    return <div className={cn(className, 'w-full space-y-8')}>{children}</div>;
}

export function SectionHeader({
    title,
    className,
    children,
}: PropsWithChildren<{ title?: string; className?: string }>) {
    return (
        <div className={cn(className, 'mb-2 flex items-center justify-between px-1 font-heading text-base font-bold')}>
            <span>{title}</span>
            <div>{children}</div>
        </div>
    );
}

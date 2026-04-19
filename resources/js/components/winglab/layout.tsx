import { cn } from '@/lib/utils';
import { PropsWithChildren, ReactNode } from 'react';

export function Space({ className, children }: PropsWithChildren<{ className?: string }>) {
    return <div className={cn(className, 'w-full space-y-8')}>{children}</div>;
}

export function SectionHeader({
    title,
    className,
    children,
}: PropsWithChildren<{ title?: string; className?: string }>) {
    return (
        <div className={cn(className, 'mb-4 flex items-center justify-between px-1')}>
            <span className="font-heading text-lg font-bold">{title}</span>
            <div>{children}</div>
        </div>
    );
}

export type PageContainerProps = PropsWithChildren<{
    title?: ReactNode;
    subTitle?: ReactNode;
    actions?: ReactNode[];
    className?: string;
}>;

export function PageContainer({ title, subTitle, actions, children, className }: PageContainerProps) {
    return (
        <div className={cn(className, 'mx-auto flex h-full min-h-full max-w-7xl flex-col gap-6 px-4 py-6')}>
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{subTitle}</p>
                </div>
                <div className="flex gap-2">{actions?.map((action) => action)}</div>
            </div>
            {children}
        </div>
    );
}

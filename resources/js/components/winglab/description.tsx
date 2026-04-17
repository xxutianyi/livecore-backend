import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

export type DescriptionProps = PropsWithChildren<{ className?: string }>;
export type DescriptionItemProps = PropsWithChildren<{ label?: string; ellipsis?: boolean; className?: string }>;

export function DescriptionItem({ label, ellipsis, className, children }: DescriptionItemProps) {
    return (
        <div className={cn(className, 'flex items-center')}>
            <span className="shrink-0 text-gray-500 dark:text-gray-400">{label}：</span>

            {ellipsis ? (
                <Tooltip>
                    <TooltipTrigger className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {children ?? '-'}
                    </TooltipTrigger>
                    <TooltipContent className="break-all">{children ?? '-'}</TooltipContent>
                </Tooltip>
            ) : (
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{children ?? '-'}</span>
            )}
        </div>
    );
}

export function Description({ className, children }: DescriptionProps) {
    return (
        <div className={cn(className, 'rounded-lg border bg-muted/50 px-4 py-2')}>
            <div className="grid grid-cols-4 gap-4 py-2">{children}</div>
        </div>
    );
}

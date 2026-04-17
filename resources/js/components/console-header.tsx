import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { useGroupMenuItemBreadcrumb } from '@/hooks/use-menu';

export function ConsoleHeader({ title }: { title?: string }) {
    const breadcrumb = useGroupMenuItemBreadcrumb();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
                <Breadcrumb items={title ? [...breadcrumb, { label: title }] : breadcrumb} />
            </div>
        </header>
    );
}

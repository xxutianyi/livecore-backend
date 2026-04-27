import { Breadcrumb, ItemType } from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';

export type PageContainerProps = PropsWithChildren<{
  breadcrumb?: ItemType[];
  title?: string;
  subTitle?: string;
  actions?: ReactNode[];
  className?: string;
}>;

export type PageContentProps = PropsWithChildren<{
  title?: string;
  subTitle?: string;
  actions?: ReactNode[];
  className?: string;
}>;

export function PageContainer({ breadcrumb = [], children, ...props }: PageContainerProps) {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb items={breadcrumb} />
        </div>
      </header>
      <ScrollArea className="h-[calc(100vh-64px)] w-full">
        <PageContent {...props}>{children}</PageContent>
      </ScrollArea>
    </>
  );
}

export function PageContent({ title, subTitle, actions, children, className }: PageContentProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={cn(
          className,
          'mx-auto flex h-full min-h-full max-w-7xl flex-col gap-6 px-4 py-6',
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-muted-foreground">{subTitle}</p>
          </div>
          <div className="flex gap-2">{actions?.map((action) => action)}</div>
        </div>
        {children}
      </div>
    </>
  );
}

export function Section({ title, children }: PropsWithChildren<{ title?: ReactNode }>) {
  return (
    <div className="flex flex-col gap-y-4">
      <span className="font-heading text-lg font-bold">{title}</span>
      {children}
    </div>
  );
}

export function SectionTitle({ title, actions }: { title?: string; actions?: ReactNode[] }) {
  return (
    <div className="flex items-center justify-between">
      <div>{title}</div>
      <div className="flex items-center gap-x-2">{actions}</div>
    </div>
  );
}

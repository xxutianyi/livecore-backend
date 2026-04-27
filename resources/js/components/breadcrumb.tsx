import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as BreadcrumbUI,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export type ItemType = {
  link?: string;
  label: string;
};

export function Breadcrumb({ items, className }: { items: ItemType[]; className?: string }) {
  return (
    <BreadcrumbUI className={cn(className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            );
          }

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild={!!item.link}
                  className={item.link ?? 'pointer-events-none'}
                >
                  {item.link ? <Link href={item.link}>{item.label}</Link> : item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {items.length !== index + 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbUI>
  );
}

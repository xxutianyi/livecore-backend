import { RouteItemGroup } from '@/constant/routes';

export function useRoutes(routes: RouteItemGroup[]): RouteItemGroup[] {
    const pathname = () => {
        const href = window.location.href;

        if (href.indexOf('?') !== -1) {
            return href.slice(0, href.indexOf('?'));
        }

        return href;
    };

    function isActive(href?: string) {
        return (href && pathname() === href) || pathname().startsWith(href + '/');
    }

    return routes.map((group) => ({
        ...group,
        items: group.items?.map((item) => {
            if (item.children && item.children.length > 0) {
                let hasActiveChild = false;

                const children = item.children.map((child) => {
                    const childActive = isActive(child.href);

                    if (childActive) {
                        hasActiveChild = true;
                    }

                    return { ...child, isActive: childActive };
                });

                return { ...item, children, isActive: hasActiveChild };
            }

            return { ...item, isActive: isActive(item.href) };
        }),
    }));
}

export function useRouteBreadcrumbs(routes: RouteItemGroup[]) {
    const items = useRoutes(routes);
    const breadcrumb: { link?: string; label: string }[] = [];

    items.forEach((group) => {
        group.items?.map((item) => {
            if (item.isActive) {
                breadcrumb.push({ label: group.title });
                breadcrumb.push({ label: item.title, link: item.href });
            }

            if (item.children && item.children.length > 0) {
                item.children.forEach((child) => {
                    if (child.isActive) {
                        breadcrumb.push({ label: child.title, link: item.href });
                    }
                });
            }
        });
    });

    return breadcrumb;
}

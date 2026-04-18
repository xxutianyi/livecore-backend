import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { RouteItemGroup } from '@/constant/routes';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function AdminSidebarMenu({ menu }: { menu: RouteItemGroup[] }) {
    return menu.map((group, index) => (
        <SidebarGroup key={index}>
            {group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            {group.items?.map((item, index) => {
                if (item.children && item.children?.length > 0) {
                    return (
                        <Collapsible key={index} className="group/collapsible" defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton isActive={item.isActive}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((childItem, i) => (
                                            <SidebarMenuSubItem key={i}>
                                                <SidebarMenuSubButton asChild isActive={childItem.isActive}>
                                                    {childItem.external ? (
                                                        <a href={childItem.href ?? ''} target="_blank">
                                                            <span>{childItem.title}</span>
                                                        </a>
                                                    ) : (
                                                        <Link href={childItem.href ?? ''}>
                                                            <span>{childItem.title}</span>
                                                        </Link>
                                                    )}
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                            {item.external ? (
                                <a href={item.href ?? ''} target="_blank">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </a>
                            ) : (
                                <Link href={item.href ?? ''}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarGroup>
    ));
}

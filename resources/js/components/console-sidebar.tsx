import WingLab from '@/assets/WingLab/WingLab.svg?react';
import { ModeToggle } from '@/components/theme-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useGroupedMenuItems } from '@/hooks/use-menu';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, ChevronsUpDownIcon, LogOutIcon, Settings, User } from 'lucide-react';

export function ConsoleSidebar() {
    const { isMobile } = useSidebar();
    const { user } = usePage<SharedProps>().props;
    const menuItems = useGroupedMenuItems();

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex h-12 w-full items-center justify-between px-2">
                    <Link href="/dashboard">
                        <div className="flex items-center gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary">
                                <WingLab className="size-4 fill-white" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">WingLab</span>
                                <span className="truncate text-xs">直播管理后台</span>
                            </div>
                        </div>
                    </Link>
                    <ModeToggle />
                </div>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group, index) => (
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
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar>
                                        <AvatarFallback>
                                            <User />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user?.name}</span>
                                    </div>
                                    <ChevronsUpDownIcon className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? 'bottom' : 'right'}
                                align="end"
                                sideOffset={4}
                            >
                                <Link href="/profile" as={DropdownMenuItem}>
                                    <Settings />
                                    账号设置
                                </Link>
                                <DropdownMenuSeparator />
                                <Link href="/logout" as={DropdownMenuItem} method="post">
                                    <LogOutIcon />
                                    退出账号
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

import { ModeToggle } from '@/components/theme-provider';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { RouteItemGroup } from '@/constant/routes';
import configs from '@/lib/configs';
import { AdminSidebarMenu } from './admin-sidebar-menu';
import { AdminUserNav } from './admin-user-nav';

import styles from '../admin.module.css';

export function AdminSidebar({ menu }: { menu: RouteItemGroup[] }) {
    return (
        <Sidebar className={styles.sidebar}>
            <SidebarHeader>
                <div className={styles.title}>
                    <div data-solt="sidebar-title-layout">
                        <div data-solt="sidebar-title-icon">
                            <img alt="logo" src={configs.APP_ADMIN_LOGO} width={32} height={32} />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{configs.APP_NAME}</span>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <AdminSidebarMenu menu={menu} />
            </SidebarContent>
            <SidebarFooter>
                <AdminUserNav />
            </SidebarFooter>
        </Sidebar>
    );
}

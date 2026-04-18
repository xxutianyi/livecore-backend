import { ModeToggle } from '@/components/theme-provider';
import { WebsiteUserAction } from '@/layouts/components/website-header';
import configs from '@/lib/configs';
import { PropsWithChildren } from 'react';

import { Head, Link } from '@inertiajs/react';
import styles from './website.module.css';

export function WebsiteLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={styles.header}>
                <Link href="/">
                    <div className={styles.title}>
                        <img alt="logo" src={configs.APP_LOGO} width={32} height={32} />
                        <h1>{configs.APP_NAME}</h1>
                    </div>
                </Link>
                <div className="space-x-4">
                    <WebsiteUserAction />
                    <ModeToggle />
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}

import { Separator } from '@/components/ui/separator';
import { PageContainer } from '@/components/winglab/layout';
import { WebsiteLayout } from '@/layouts/website-layout';
import { PasswordForm } from './partial/password';
import { ProfileForm } from './partial/profile';

export default function Profile() {
    return (
        <WebsiteLayout>
            <PageContainer title="账号设置">
                <Separator />
                <ProfileForm />
                <Separator />
                <PasswordForm />
            </PageContainer>
        </WebsiteLayout>
    );
}

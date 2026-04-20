import { Separator } from '@/components/ui/separator';
import { WebsiteLayout } from '@/layouts/website-layout';
import { PasswordForm } from '@/pages/website/profile/partial/password';
import { ProfileForm } from '@/pages/website/profile/partial/profile';

export default function Profile() {
    return (
        <WebsiteLayout title="账号设置">
            <div className="flex flex-col space-y-8">
                <ProfileForm />
                <Separator />
                <PasswordForm />
            </div>
        </WebsiteLayout>
    );
}

import { Separator } from '@/components/ui/separator';
import { Space } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveMessage, User, UserOnline } from '@/services/model';
import { MessageTable } from './partial/message';
import { Online } from './partial/online';
import { UserDetail } from './partial/user-detail';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
    return (
        <AdminLayout breadcrumbTitle={user.name}>
            <Space>
                <UserDetail user={user} />
                <Separator />
                <Online onlines={onlines} />
                <Separator />
                <MessageTable messages={messages} />
            </Space>
        </AdminLayout>
    );
}

import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveMessage, User, UserOnline } from '@/services/model';
import { UserDetail } from './partial/detail';
import { UserUpdate } from './partial/forms';
import { MessageTable } from './partial/message';
import { Online } from './partial/online';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
    return (
        <AdminLayout breadcrumbTitle={user.name}>
            <PageContainer title="观众信息" actions={[<UserUpdate user={user} key="update" />]}>
                <Separator />
                <UserDetail user={user} />
                <Separator />
                <Online onlines={onlines} />
                <Separator />
                <MessageTable messages={messages} />
            </PageContainer>
        </AdminLayout>
    );
}

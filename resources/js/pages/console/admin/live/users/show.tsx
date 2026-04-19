import { Separator } from '@/components/ui/separator';
import { PageContainer, SectionHeader } from '@/components/winglab/layout';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveMessage, User, UserOnline } from '@/services/model';
import { MessageTable } from './partial/message';
import { Online } from './partial/online';
import { UserDetail } from './partial/user-detail';
import { UserUpdate } from './partial/user-forms';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
    return (
        <AdminLayout breadcrumbTitle={user.name}>
            <PageContainer title="观众信息" actions={[<UserUpdate user={user} key="update" />]}>
                <Separator />
                <div>
                    <SectionHeader title="用户信息" />
                    <UserDetail user={user} />
                </div>
                <Separator />
                <div>
                    <SectionHeader title="访问记录" />
                    <Online onlines={onlines} />
                </div>
                <Separator />
                <div>
                    <SectionHeader title="评论记录" />
                    <MessageTable messages={messages} />
                </div>
            </PageContainer>
        </AdminLayout>
    );
}

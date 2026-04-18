import { Separator } from '@/components/ui/separator';
import { AdminLayout } from '@/layouts/admin-layout';
import { LiveMessage, User, UserOnline } from '@/services/model';
import { MessageTable } from './partial/message';
import { Online } from './partial/online';
import { UserDetail } from './partial/user-forms';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
    return (
        <AdminLayout breadcrumbTitle={user.name} className="p-4">
            <div className="w-full space-y-4">
                <UserDetail user={user} />
                <Separator />
                <Online onlines={onlines} />
                <Separator />
                <MessageTable messages={messages} />
            </div>
        </AdminLayout>
    );
}

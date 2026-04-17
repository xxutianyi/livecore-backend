import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { LiveMessage, User, UserOnline } from '@/services/model';
import { UserDetail } from './partial/forms';
import { MessageTable } from './partial/message';
import { Online } from './partial/online';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
    return (
        <ConsoleLayout breadcrumbTitle={user.name} className="p-4">
            <div className="w-full space-y-4">
                <UserDetail user={user} />
                <Separator />
                <Online onlines={onlines} />
                <Separator />
                <MessageTable messages={messages} />
            </div>
        </ConsoleLayout>
    );
}

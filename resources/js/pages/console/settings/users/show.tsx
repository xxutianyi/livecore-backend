import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { UserDetail } from './partial/detail';
import { UserUpdate } from './partial/forms';
import { MessageIndex } from './partial/messages';
import { OnlineIndex } from './partial/onlines';

type PageProps = { user: User };

export default function Show({ user }: PageProps) {
  return (
    <ConsoleLayout>
      <PageContainer
        title="观众信息"
        breadcrumb={[
          { label: '观众管理', link: route('settings.users.index') },
          { label: user.name, link: route('settings.users.show', user.id) },
        ]}
        actions={[<UserUpdate user={user} key="update" />]}
      >
        <Separator />
        <UserDetail user={user} />
        <Separator />
        <OnlineIndex onlines={user.onlines ?? []} />
        <Separator />
        <MessageIndex messages={user.messages ?? []} />
      </PageContainer>
    </ConsoleLayout>
  );
}

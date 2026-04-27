import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { UserDetail } from './partial/detail';
import { UserUpdate } from './partial/forms';
import { RoomIndex, RoomUpdate } from './partial/rooms';

export default function Show({ user }: { user: User }) {
  return (
    <ConsoleLayout>
      <PageContainer
        title="管理员信息"
        breadcrumb={[
          { label: '管理员', link: route('systems.users.index') },
          { label: user.name, link: route('systems.users.show', user.id) },
        ]}
        actions={[
          <UserUpdate user={user} key="update" />,
          <RoomUpdate user={user} key="manageable" />,
        ]}
      >
        <Separator />
        <UserDetail user={user} />
        <Separator />
        <RoomIndex user={user} />
      </PageContainer>
    </ConsoleLayout>
  );
}

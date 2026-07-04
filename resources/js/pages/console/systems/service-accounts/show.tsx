import { PageContainer } from '@/components/container';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { RoomIndex, RoomUpdate } from '../users/partial/rooms';
import { ServiceAccountDetail } from './partial/detail';
import { ServiceAccountDelete, ServiceAccountUpdate } from './partial/forms';

export default function Show({ user }: { user: User }) {
  return (
    <ConsoleLayout>
      <PageContainer
        title="影子用户信息"
        breadcrumb={[
          { label: '影子用户', link: route('systems.service-accounts.index') },
          { label: user.name, link: route('systems.service-accounts.show', user.id) },
        ]}
        actions={[
          <ServiceAccountUpdate user={user} key="update" />,
          <RoomUpdate
            user={user}
            key="manageable"
            routeName="systems.service-accounts.manageable"
          />,
          <ServiceAccountDelete user={user} key="delete" />,
        ]}
      >
        <Separator />
        <ServiceAccountDetail user={user} />
        <Separator />
        <RoomIndex user={user} />
      </PageContainer>
    </ConsoleLayout>
  );
}

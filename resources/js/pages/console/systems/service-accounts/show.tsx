import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { User } from '@/services/model';
import { Link } from '@inertiajs/react';
import { RoomIndex, RoomUpdate } from '../users/partial/rooms';
import { ServiceAccountDetail } from './partial/detail';
import { ServiceAccountUpdate } from './partial/forms';

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
          <Button key="delete" asChild variant="destructive">
            <Link href={route('systems.service-accounts.destroy', user.id)} method="delete">
              删除影子用户
            </Link>
          </Button>,
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

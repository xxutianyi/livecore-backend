import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConsoleLayout } from '@/layouts/console-layout';
import { LiveRoom, UserGroup } from '@/services/model';
import { Link } from '@inertiajs/react';
import { RoomDetail } from './partial/detail';
import { CoverUpdate, RoomUpdate } from './partial/forms';
import { GroupIndex, GroupUpdate } from './partial/groups';

export default function Show({ room, groups }: { room: LiveRoom; groups: UserGroup[] }) {
  return (
    <ConsoleLayout>
      <PageContainer
        title="直播间信息"
        breadcrumb={[
          { label: '直播间', link: route('settings.rooms.index') },
          { label: room.name, link: route('settings.rooms.show', room.id) },
        ]}
        actions={[
          <RoomUpdate room={room} key="update" />,
          <CoverUpdate room={room} key="cover" />,
          <GroupUpdate room={room} groups={groups} key="group" />,
          <Button asChild key="playback">
            <Link href={route('broadcast.playbacks', room.id)}>管理回放</Link>
          </Button>,
        ]}
      >
        <Separator />
        <RoomDetail room={room} />
        <Separator />
        <GroupIndex groups={groups} />
      </PageContainer>
    </ConsoleLayout>
  );
}

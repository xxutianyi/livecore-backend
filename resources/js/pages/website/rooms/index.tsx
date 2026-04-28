import { Breadcrumb } from '@/components/breadcrumb';
import { RoomCardList } from '@/components/watch';
import { WebsiteLayout } from '@/layouts/website-layout';
import { LiveRoom } from '@/services/model';

export default function Rooms({ rooms }: { rooms: LiveRoom[] }) {
  return (
    <WebsiteLayout>
      <Breadcrumb className="mb-4 md:mb-8" items={[{ label: '全部直播间' }]} />
      <div className="grid gap-x-4 gap-y-8 md:grid-cols-4">
        <RoomCardList rooms={rooms} />
      </div>
    </WebsiteLayout>
  );
}

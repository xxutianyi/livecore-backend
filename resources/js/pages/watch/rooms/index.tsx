import { RoomCardList } from '@/components/rooms';
import { GridLayout } from '@/components/watch/layouts';
import { Breadcrumb } from '@/components/winglab/breadcrumb';
import { WebsiteLayout } from '@/layouts/website-layout';
import { LiveRoom } from '@/services/model';

export default function Rooms({ rooms }: { rooms: LiveRoom[] }) {
    const breadcrumbItem = [
        {
            label: '全部直播间',
        },
    ];

    return (
        <WebsiteLayout title="全部直播间">
            <Breadcrumb className="mb-4 px-2 md:mb-8" items={breadcrumbItem} />
            <GridLayout>
                <RoomCardList rooms={rooms} />
            </GridLayout>
        </WebsiteLayout>
    );
}

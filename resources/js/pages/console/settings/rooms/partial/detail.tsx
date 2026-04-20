import { Description, DescriptionItem } from '@/components/winglab/description';
import { Section } from '@/components/winglab/layout';
import { LiveRoom } from '@/services/model';

export function RoomDetail({ room }: { room: LiveRoom }) {
    return (
        <Section title="基本信息">
            <div className="flex w-full items-stretch gap-x-4">
                <img alt="cover" src={room.cover} className="aspect-video w-1/6 rounded-3xl" />
                <Description className="w-full">
                    <DescriptionItem label="名称" className="col-span-4">
                        {room.name}
                    </DescriptionItem>
                    <DescriptionItem label="简介" className="col-span-4">
                        {room.description}
                    </DescriptionItem>
                </Description>
            </div>
        </Section>
    );
}

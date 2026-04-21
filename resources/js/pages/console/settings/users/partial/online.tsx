import { Section } from '@/components/winglab/layout';
import { diffDatetime, formatDatetime } from '@/lib/utils';
import { UserOnline } from '@/services/model';
import { defineColumns, SimpleTable } from '@winglab/inertia-table';

export function Online({ onlines }: { onlines: UserOnline[] }) {
    const onlineColumns = defineColumns<UserOnline>([
        {
            title: '直播间',
            dataKey: ['room', 'name'],
        },
        {
            title: '场次',
            dataKey: ['event', 'name'],
        },
        {
            title: '开始时间',
            dataKey: 'joined_at',
            tableRowRender: (data) => formatDatetime(data.joined_at),
        },
        {
            title: '结束时间',
            dataKey: 'leaving_at',
            tableRowRender: (data) => formatDatetime(data.leaving_at),
        },
        {
            title: '在线时长',
            tableRowRender: (data) => diffDatetime(data.joined_at, data.leaving_at),
        },
        {
            title: '直播/回放',
            dataKey: 'living',
            tableRowRender: (data) => (data.living ? '直播' : '回放'),
        },
    ]);

    return (
        <Section title="观看记录">
            <SimpleTable data={onlines} columns={onlineColumns} />
        </Section>
    );
}

import { defineColumns, SimpleTable } from '@/components/table';
import { diffDatetime, formatDatetime } from '@/lib/utils';
import { OnlineMetas } from '@/pages/console/live-room/user/partial/online-metas';
import { UserOnline } from '@/services/model';

export function Online({ onlines }: { onlines: UserOnline[] }) {
    const onlineColumns = defineColumns<UserOnline>([
        {
            title: '上线时间',
            dataKey: 'joined_at',
            tableRowRender: (data) => formatDatetime(data.joined_at),
        },
        {
            title: '下线时间',
            dataKey: 'leaving_at',
            tableRowRender: (data) => formatDatetime(data.leaving_at),
        },
        {
            title: '在线时长',
            tableRowRender: (data) => diffDatetime(data.joined_at, data.leaving_at),
        },
        {
            title: '轨迹数量',
            dataKey: 'heartbeats_count',
        },
        {
            index: 'actions',
            tableRowRender: (data) => <OnlineMetas metas={data.heartbeats} />,
        },
    ]);

    return (
        <>
            <div className="font-heading text-base font-bold">访问记录</div>
            <SimpleTable data={onlines} columns={onlineColumns} />
        </>
    );
}

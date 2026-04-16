import { Description, DescriptionItem } from '@/components/description';
import { defineColumns, SimpleTable } from '@/components/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ConsoleLayout } from '@/layouts/console-layout';
import { formatDate, formatDatetime } from '@/lib/utils';
import { LiveMessage, User, UserOnline } from '@/services/model';

type PageProps = { user: User; onlines: UserOnline[]; messages: LiveMessage[] };

export default function Show({ user, onlines, messages }: PageProps) {
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
    ]);

    const messagesColumns = defineColumns<LiveMessage>([
        {
            title: '直播间',
            dataKey: ['event', 'room', 'name'],
        },
        {
            title: '场次名称',
            dataKey: ['event', 'name'],
        },
        {
            title: '评论内容',
            dataKey: 'content',
            tableRowRender: (data) => (
                <Tooltip>
                    <TooltipTrigger className="block max-w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                        {data.content}
                    </TooltipTrigger>
                    <TooltipContent>{data.content}</TooltipContent>
                </Tooltip>
            ),
        },
        {
            title: '评论时间',
            dataKey: 'created_at',
            tableRowRender: (data) => formatDatetime(data.created_at),
        },
        {
            title: '审核时间',
            dataKey: 'reviewed_at',
            tableRowRender: (data) => formatDatetime(data?.reviewed_at),
        },
    ]);

    return (
        <ConsoleLayout breadcrumbTitle={user.name} className="p-4">
            <div className="w-full space-y-4">
                <div className="font-heading text-base font-bold">用户信息</div>
                <Description>
                    <DescriptionItem label="姓名">{user.name}</DescriptionItem>
                    <DescriptionItem label="手机号">
                        <span className="flex items-center gap-x-2">
                            {user.phone}
                            {user.phone && user.phone_verified_at ? (
                                <Badge>已验证</Badge>
                            ) : (
                                <Badge variant="destructive">未验证</Badge>
                            )}
                        </span>
                    </DescriptionItem>
                    <DescriptionItem label="电子邮件">
                        <span className="flex items-center gap-x-2">
                            {user.email}
                            {user.email && user.email_verified_at ? (
                                <Badge>已验证</Badge>
                            ) : (
                                <Badge variant="destructive">未验证</Badge>
                            )}
                        </span>
                    </DescriptionItem>
                    <DescriptionItem label="邀请人代码">{user.invitation_code}</DescriptionItem>
                    <DescriptionItem label="注册日期">{formatDate(user.created_at)}</DescriptionItem>
                    <DescriptionItem label="上次在线时间">
                        1231231211313111313132132132475644sdsadsacacfasdax12a311
                    </DescriptionItem>
                </Description>
                <Separator />
                <div className="font-heading text-base font-bold">观看记录</div>
                <SimpleTable data={onlines} columns={onlineColumns} />
                <Separator />
                <div className="font-heading text-base font-bold">评论记录</div>
                <SimpleTable data={messages} columns={messagesColumns} />
            </div>
        </ConsoleLayout>
    );
}

import { Description, DescriptionItem } from '@/components/description';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDatetime } from '@/lib/utils';
import { User } from '@/services/model';

export function UserDetail({ user }: { user: User }) {
    return (
        <>
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
                <DescriptionItem label="在线状态">
                    <span className="flex items-center gap-x-2">
                        <Badge variant={user.online ? 'default' : 'secondary'}>{user.online ? '在线' : '离线'}</Badge>
                    </span>
                </DescriptionItem>
                <DescriptionItem label="上次在线时间">{formatDatetime(user.leaving_at)}</DescriptionItem>
            </Description>
        </>
    );
}

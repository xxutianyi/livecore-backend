import { Badge } from '@/components/ui/badge';
import { Description, DescriptionItem } from '@/components/winglab/description';
import { formatDate } from '@/lib/utils';
import { User } from '@/services/model';

export function UserDetail({ user }: { user: User }) {
    return (
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
            <DescriptionItem label="注册日期">{formatDate(user.created_at)}</DescriptionItem>
        </Description>
    );
}

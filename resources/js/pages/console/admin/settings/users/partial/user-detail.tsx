import { Badge } from '@/components/ui/badge';
import { Description, DescriptionItem } from '@/components/winglab/description';
import { SectionHeader } from '@/components/winglab/layout';
import { formatDate } from '@/lib/utils';
import { User } from '@/services/model';
import { UserUpdate } from './user-forms';

export function UserDetail({ user }: { user: User }) {
    return (
        <>
            <SectionHeader title="管理员信息">
                <UserUpdate user={user} />
            </SectionHeader>
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
        </>
    );
}

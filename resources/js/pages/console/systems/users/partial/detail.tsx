import { Section } from '@/components/container';
import { Description, DescriptionItem } from '@/components/description';
import { formatDate } from '@/lib/utils';
import { User } from '@/services/model';

export function UserDetail({ user }: { user: User }) {
    return (
        <Section title="基本信息">
            <Description>
                <DescriptionItem label="姓名">{user.name}</DescriptionItem>
                <DescriptionItem label="手机号">{user.phone}</DescriptionItem>
                <DescriptionItem label="电子邮件">{user.email}</DescriptionItem>
                <DescriptionItem label="注册日期">{formatDate(user.created_at)}</DescriptionItem>
            </Description>
        </Section>
    );
}

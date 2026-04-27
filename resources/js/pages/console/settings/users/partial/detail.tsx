import { Section } from '@/components/container';
import { Description, DescriptionItem } from '@/components/description';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDatetime } from '@/lib/utils';
import { User } from '@/services/model';

export function UserDetail({ user }: { user: User }) {
  return (
    <Section title="用户信息">
      <Description>
        <DescriptionItem label="姓名">{user.name}</DescriptionItem>
        <DescriptionItem label="手机号">{user.phone}</DescriptionItem>
        <DescriptionItem label="电子邮件">{user.email}</DescriptionItem>
        <DescriptionItem label="邀请人代码">{user.invitation_code}</DescriptionItem>
        <DescriptionItem label="注册日期">{formatDate(user.created_at)}</DescriptionItem>
        <DescriptionItem label="在线状态">
          <span className="flex items-center gap-x-2">
            <Badge variant={user.online ? 'default' : 'secondary'}>
              {user.online ? '在线' : '离线'}
            </Badge>
          </span>
        </DescriptionItem>
        <DescriptionItem label="在线时间">{formatDatetime(user.leaving_at)}</DescriptionItem>
        <DescriptionItem label="分组">
          {user.groups?.map((group, index) => (
            <span key={index}>
              {group.name}
              {index + 1 !== user.groups?.length && <>&nbsp;,&nbsp;</>}
            </span>
          ))}
        </DescriptionItem>
      </Description>
    </Section>
  );
}

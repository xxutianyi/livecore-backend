import { Section } from '@/components/container';
import { Description, DescriptionItem } from '@/components/description';
import { formatDate } from '@/lib/utils';
import { User } from '@/services/model';

export function ServiceAccountDetail({ user }: { user: User }) {
  return (
    <Section title="基本信息">
      <Description>
        <DescriptionItem label="名称">{user.name}</DescriptionItem>
        <DescriptionItem label="类型">影子用户</DescriptionItem>
        <DescriptionItem label="角色">直播管理员</DescriptionItem>
        <DescriptionItem label="创建日期">{formatDate(user.created_at)}</DescriptionItem>
      </Description>
    </Section>
  );
}

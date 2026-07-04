import { Section } from '@/components/container';
import { Description, DescriptionItem } from '@/components/description';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { User } from '@/services/model';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function ServiceAccountDetail({ user }: { user: User }) {
  function onCopyId() {
    navigator.clipboard
      .writeText(user.id)
      .then(() => {
        toast.success('影子用户 ID 已复制');
      })
      .catch(() => {
        toast.error('复制失败，请手动复制');
      });
  }

  return (
    <Section title="基本信息">
      <Description>
        <DescriptionItem label="ID" className="col-span-4">
          <span className="flex min-w-0 items-center gap-x-2">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm">
              {user.id}
            </span>
            <Button size="icon-xs" variant="outline" onClick={onCopyId}>
              <Copy />
            </Button>
          </span>
        </DescriptionItem>
        <DescriptionItem label="名称">{user.name}</DescriptionItem>
        <DescriptionItem label="类型">影子用户</DescriptionItem>
        <DescriptionItem label="角色">直播管理员</DescriptionItem>
        <DescriptionItem label="创建日期">{formatDate(user.created_at)}</DescriptionItem>
      </Description>
    </Section>
  );
}

import { Section } from '@/components/container';
import { Button } from '@/components/ui/button';
import { formatDatetime } from '@/lib/utils';
import { LiveEvent } from '@/services/model';
import { router } from '@inertiajs/react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function Configs({ event }: { event: LiveEvent }) {
  const splitIndex = event.push_url.indexOf(event.id);
  const pushServer = event.push_url.slice(0, splitIndex);
  const pushSecret = event.push_url.slice(splitIndex);
  const refreshDisabled = !!event.started_at && !event.finished_at;

  function onCopyPushServer() {
    navigator.clipboard
      .writeText(pushServer)
      .then(() => {
        toast.success('服务器已复制到剪贴板，请在OBS粘贴');
      })
      .catch(() => {
        toast.error('复制失败，请手动复制');
      });
  }
  function onCopyPushSecret() {
    navigator.clipboard
      .writeText(pushSecret)
      .then(() => {
        toast.success('推流码已复制到剪贴板，请在OBS粘贴');
      })
      .catch(() => {
        toast.error('复制失败，请手动复制');
      });
  }

  function onRefreshExpire() {
    if (!refreshDisabled) {
      router.put(route('broadcast.direction.update', [event.room_id, event.id]));
      toast.success('刷新成功，请重新推送推流参数');
    } else {
      toast.warning('推流已经开始，无法刷新过期时间');
    }
  }

  return (
    <Section title="推流参数">
      <div className="flex items-center divide-x divide-border rounded-3xl border">
        <div className="flex w-32 flex-col divide-y divide-border rounded-l-3xl bg-muted text-center">
          <span className="px-2 py-2">服务器</span>
          <span className="px-2 py-2">推流码</span>
          <span className="px-2 py-2">过期时间</span>
        </div>
        <div className="flex flex-1 flex-col divide-y divide-border">
          <span className="flex justify-between px-4 py-2 font-mono">
            {pushServer}
            <Button size="icon-xs" onClick={onCopyPushServer}>
              <Copy />
            </Button>
          </span>
          <span className="flex justify-between px-4 py-2 font-mono">
            {pushSecret}
            <Button size="icon-xs" onClick={onCopyPushSecret}>
              <Copy />
            </Button>
          </span>
          <span className="flex gap-x-2 px-4 py-2 font-mono">
            {formatDatetime(event.expired_at)}
            <Button size="xs" onClick={onRefreshExpire} disabled={refreshDisabled}>
              刷新过期时间
            </Button>
          </span>
        </div>
      </div>
    </Section>
  );
}

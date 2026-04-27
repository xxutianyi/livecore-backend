import { Section, SectionTitle } from '@/components/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useOBS } from '@/hooks/use-obs';
import { LiveEvent } from '@/services/model';
import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'sonner';

export function ObsSettings({
  handleSubmit,
}: {
  handleSubmit: (data: { server: string; password: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>设置OBS</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置连接参数</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            handleSubmit(data as { server: string; password: string });
            setOpen(false);
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="server">服务器</FieldLabel>
              <Input
                id="server"
                name="server"
                placeholder="请输入"
                defaultValue="ws://localhost:4455"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">服务器密码</FieldLabel>
              <Input id="password" name="password" placeholder="请输入" required />
            </Field>
            <Field>
              <Button type="submit">保存</Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ObsController({ event }: { event: LiveEvent }) {
  const splitIndex = event.push_url.indexOf(event.id);
  const pushServer = event.push_url.slice(0, splitIndex);
  const pushSecret = event.push_url.slice(splitIndex);

  const savedServer = localStorage.getItem('obs-server') ?? undefined;
  const savedPassword = localStorage.getItem('obs-password') ?? undefined;

  const [server, setServer] = useState<string | undefined>(savedServer);
  const [password, setPassword] = useState<string | undefined>(savedPassword);

  const { states, functions } = useOBS(password, server);

  function handleSaveConfig(data: { server: string; password: string }) {
    functions.disconnect();
    localStorage.setItem('obs-server', data.server);
    localStorage.setItem('obs-password', data.password);

    setServer(data.server);
    setPassword(data.password);

    toast.info('保存成功，正在连接');
    functions.connect();
  }

  function handleStop() {
    functions.stopStreaming();
  }

  function handleStart() {
    functions.startStreaming();
  }

  function handleConnect() {
    functions.connect();
  }

  function handleSetConfig() {
    functions.setStreamingConfig({ server: pushServer, key: pushSecret });
  }

  const expired = dayjs(event.expired_at).isBefore(dayjs());
  const disableStop = !states.isConnected || !states.isStreaming;
  const disableStart = !states.isConnected || states.isStreaming || expired;
  const disableConnect = !server || !password || states.isConnected;
  const disableSetConfig = !states.isConnected || states.isStreaming;

  return (
    <Section
      title={
        <SectionTitle
          title="OBS控制"
          actions={[
            <Badge key="connect" variant={states.isConnected ? 'destructive' : 'secondary'}>
              {states.isConnected ? '已连接' : '未连接'}
            </Badge>,
            <Badge key="streaming" variant={states.isStreaming ? 'destructive' : 'secondary'}>
              {states.isStreaming ? '正在直播' : '未直播'}
            </Badge>,
            <Badge key="expired" variant={expired ? 'destructive' : 'default'}>
              {expired ? '请刷新过期时间' : '未过期'}
            </Badge>,
          ]}
        />
      }
    >
      <div className="mx-auto flex gap-x-2">
        <ObsSettings handleSubmit={handleSaveConfig} />
        <Button disabled={disableConnect} onClick={handleConnect}>
          连接OBS
        </Button>
        <Button disabled={disableSetConfig} onClick={handleSetConfig}>
          推送推流参数
        </Button>
        <Button disabled={disableStart} onClick={handleStart}>
          开始直播
        </Button>
        <Button disabled={disableStop} onClick={handleStop}>
          结束直播
        </Button>
      </div>
    </Section>
  );
}

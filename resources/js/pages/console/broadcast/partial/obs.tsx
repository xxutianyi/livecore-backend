import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Section, SectionTitle } from '@/components/winglab/layout';
import { useOBS } from '@/hooks/use-obs';
import { LiveEvent } from '@/services/model';
import { useState } from 'react';
import { toast } from 'sonner';

type ObsSettingData = { server: string; password: string };

export function ObsSettings({ handleSubmit }: { handleSubmit: (data: ObsSettingData) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>设置OBS</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>设置连接参数</DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData.entries());
                        handleSubmit(data as ObsSettingData);
                        setOpen(false);
                    }}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="server">服务器</FieldLabel>
                            <Input id="server" name="server" placeholder="请输入" defaultValue="ws://localhost:4455" />
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

    function handleSaveConfig(data: ObsSettingData) {
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

    const disableStop = !states.isConnected || !states.isStreaming;
    const disableStart = !states.isConnected || states.isStreaming;
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

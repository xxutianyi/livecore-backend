import OBSWebSocket from 'obs-websocket-js';
import { useState } from 'react';
import { toast } from 'sonner';

const obs = new OBSWebSocket();

export function useOBS(password?: string, server?: string) {
    const [isStreaming, setIsSteaming] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    function connect() {
        obs.connect(server ?? 'ws://localhost:4455', password)
            .then(() => {
                setIsConnected(true);
                toast.success('OBS 连接成功');

                obs.on('StreamStateChanged', (data) => {
                    setIsSteaming(data.outputActive);
                });

                obs.call('GetStreamStatus').then((res) => {
                    setIsSteaming(res.outputActive);
                });
            })
            .catch((error) => {
                toast.success('OBS 连接失败，请打开OBS-工具-WebSocket服务器设置检查配置');
                console.error('OBS 连接失败', error);
            });
    }

    function disconnect() {
        obs.disconnect();
    }

    function startStreaming() {
        if (!isConnected) {
            connect();
        }

        obs.call('StartStream')
            .then(() => {
                toast.success('已开始推流');
            })
            .catch(() => {
                toast.error('操作失败，请打开OBS手动操作');
            });
    }

    function stopStreaming() {
        if (!isConnected) {
            connect();
        }

        obs.call('StopStream')
            .then(() => {
                toast.success('已停止推流');
            })
            .catch(() => {
                toast.error('操作失败，请打开OBS手动操作');
            });
    }

    function setStreamingConfig(data: { server: string; key: string }) {
        if (!isConnected) {
            toast.info('请先连接OBS');
            return;
        }

        const settings = {
            streamServiceType: 'rtmp_custom',
            streamServiceSettings: data,
        };

        obs.call('SetStreamServiceSettings', settings)
            .then(() => {
                toast.success('配置已推送到OBS');
                obs.call('GetStreamServiceSettings').then((res) => {
                    const obsType = res.streamServiceType === 'rtmp_custom';
                    const obsSettings = res.streamServiceSettings;
                    if (obsType && obsSettings.server === data.server && obsSettings.key === data.key) {
                        toast.success('配置校验成功，可以开始直播');
                    }
                });
            })
            .catch(() => {
                toast.error('操作失败，请打开OBS手动操作');
            });
    }

    return {
        states: { isConnected, isStreaming },
        functions: { connect, disconnect, startStreaming, stopStreaming, setStreamingConfig },
    };
}

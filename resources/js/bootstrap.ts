import { initializeTheme } from '@/hooks/use-theme';
import { configureEcho } from '@laravel/echo-react';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

// 初始化全局 dayjs 配置
dayjs.locale('zh-cn');
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsDuration);
dayjs.tz.guess();

// 初始化全局 echo 配置
configureEcho({ broadcaster: 'reverb' });

// 初始化主题配置
initializeTheme();

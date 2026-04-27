import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import { initializeTheme } from '@/hooks/use-theme';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.css';
import './app.css';

const appName = import.meta.env.VITE_APP_NAME;

dayjs.locale('zh-cn');
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsDuration);
dayjs.tz.guess();

configureEcho({ broadcaster: 'reverb' });

createInertiaApp({
  title: (title) => (title ? `${title} | ${appName}` : appName),
  pages: { path: './pages', extension: '.tsx' },
  progress: { color: '#9ae600' },
});

initializeTheme();

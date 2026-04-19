import { createInertiaApp } from '@inertiajs/react';
import { configureEcho } from '@laravel/echo-react';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import 'filepond/dist/filepond.min.css';
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

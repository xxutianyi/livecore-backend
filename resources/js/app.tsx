import { initializeTheme } from '@/hooks/use-theme';
import { createInertiaApp } from '@inertiajs/react';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.css';
import './app.css';

dayjs.locale('zh-cn');
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsDuration);
dayjs.tz.guess();

createInertiaApp({
  pages: { path: './pages', extension: '.tsx' },
  progress: { color: '#9ae600' },
});

initializeTheme();

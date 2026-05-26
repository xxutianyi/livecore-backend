import { createInertiaApp } from '@inertiajs/react';
import './bootstrap';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.css';
import './app.css';

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
  title: (title) => (title ? `${title} | ${appName}` : appName),
  pages: { path: './pages', extension: '.tsx' },
  progress: { color: '#9ae600' },
});

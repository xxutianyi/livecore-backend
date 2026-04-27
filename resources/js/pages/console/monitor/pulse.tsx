import { ConsoleLayout } from '@/layouts/console-layout';

export default function MonitorPage() {
  return (
    <ConsoleLayout>
      <iframe src={'/pulse'} className="h-[calc(100vh-64px)] w-full" />
    </ConsoleLayout>
  );
}

import WingLab from '@/assets/WingLab/WingLab.svg?react';
import { Button } from '@/components/ui/button';
import { WebsiteLayout } from '@/layouts/website-layout';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, LogInIcon } from 'lucide-react';

export default function Welcome() {
  return (
    <WebsiteLayout>
      <div className="flex h-[calc(100vh-128px)] flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-x-2">
          <WingLab className="size-8 fill-primary" />
          WingLab 直播系统
        </div>
        <div className="mt-8 space-x-2">
          <Link href={route('watch.rooms.index')}>
            <Button size="lg">
              <LogInIcon />
              观看直播
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            <LayoutDashboard />
            管理后台
          </Button>
        </div>
      </div>
    </WebsiteLayout>
  );
}

import { PageContainer } from '@/components/container';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ConsoleLayout } from '@/layouts/console-layout';
import { Info } from 'lucide-react';
import { RoomSelect } from './components/rooms';

export default function Welcome() {
  return (
    <ConsoleLayout>
      <PageContainer
        title="直播控制"
        actions={[<RoomSelect route={window.location.pathname} key="select" />]}
      >
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Info />
            </EmptyMedia>
            <EmptyTitle>未选择直播间</EmptyTitle>
            <EmptyDescription>点击右上方按钮选择要开播的直播间</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PageContainer>
    </ConsoleLayout>
  );
}

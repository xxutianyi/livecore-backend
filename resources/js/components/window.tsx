import { Button } from '@/components/ui/button';
import { Minus, SquareArrowUpRight } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Rnd } from 'react-rnd';

export default function FloatingWindow({ title, children }: PropsWithChildren<{ title: string }>) {
    const [isMinimized, setIsMinimized] = useState(true);

    if (isMinimized) {
        return (
            <Button className="fixed right-6 bottom-6 z-50" onClick={() => setIsMinimized(false)}>
                <span>{title}</span>
                <SquareArrowUpRight />
            </Button>
        );
    }

    return (
        <Rnd
            enableResizing={false}
            default={{ x: 16, y: 16, width: 640, height: 360 + 32 }}
            dragHandleClassName="drag-handle"
            className="z-50 overflow-hidden rounded-2xl border border-red-500 bg-accent shadow-2xl"
        >
            {/* 标题栏 - 可拖动区域 */}
            <div className="drag-handle flex cursor-move items-center justify-between bg-muted px-4 py-1 select-none">
                <div className="text-sm text-foreground">{title}</div>
                <Button size="icon-xs" variant="secondary" onClick={() => setIsMinimized(true)}>
                    <Minus />
                </Button>
            </div>

            {/* 内容区域 */}
            <div className="h-[calc(100%-32px)] overflow-hidden">{children}</div>
        </Rnd>
    );
}

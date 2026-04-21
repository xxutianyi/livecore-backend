import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LiveRoom } from '@/services/model';
import { SharedProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export function RoomSelect({ route }: { route: string }) {
    const [open, setOpen] = useState(false);

    const { room, options } = usePage<SharedProps & { room?: LiveRoom }>().props;

    function handleSelect(value: string) {
        router.get(`${route}/${value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="destructive" className="h-auto min-h-10 w-64 justify-between px-3 py-2">
                    <div className="flex flex-wrap gap-2 overflow-hidden">
                        <span className="">{room ? `当前直播间：${room.name}` : '选择直播间'}</span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                onWheel={(e) => e.stopPropagation()}
                className="w-(--radix-popover-trigger-width) p-0"
            >
                <Command>
                    <CommandInput placeholder="搜索..." />
                    <CommandList>
                        <CommandEmpty>没有找到匹配项</CommandEmpty>
                        <CommandGroup>
                            {options.rooms.map((option, index) => (
                                <CommandItem key={index} value={option.name} onSelect={() => handleSelect(option.id)}>
                                    {option.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

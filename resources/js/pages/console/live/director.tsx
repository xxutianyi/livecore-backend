import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ConsoleLayout } from '@/layouts/console-layout';
import { cn } from '@/lib/utils';
import { LiveRoom } from '@/services/model';
import { SharedProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

function RoomSelect({ room }: { room?: LiveRoom }) {
    const [open, setOpen] = useState(false);
    const { options } = usePage<SharedProps & { room?: LiveRoom }>().props;

    function handleSelect(roomId: LiveRoom['id']) {
        router.get(route('console.live.director', roomId));
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-auto min-h-10 w-48 justify-between bg-muted px-3 py-2">
                    <div className="flex flex-wrap gap-2">{room?.name ? room.name : '选择直播间'}</div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                    <CommandInput placeholder="搜索..." />
                    <CommandList>
                        <CommandEmpty>没有找到匹配项</CommandEmpty>
                        <CommandGroup>
                            {options.rooms.map((option, index) => (
                                <CommandItem key={index} value={option.name} onSelect={() => handleSelect(option.id)}>
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            option.id === room.id ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
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
export default function Director({ room }: { room?: LiveRoom }) {
    const { options } = usePage<SharedProps>().props;

    return (
        <ConsoleLayout breadcrumbTitle={room?.name} className="p-4">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between font-heading text-base font-bold">
                    <RoomSelect room={room} />
                </div>
                <div></div>
            </div>
        </ConsoleLayout>
    );
}

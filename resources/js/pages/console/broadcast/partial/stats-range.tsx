import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import qs from 'qs';

export function StatsRangeRoom() {
    const query = qs.parse(window.location.search.substring(1));

    const range = query?.['range'] ?? '1h';

    function handleSelect(value: string) {
        router.get(window.location.href, { range: value }, { preserveScroll: true, preserveState: true });
    }

    return (
        <Select value={range as string} onValueChange={handleSelect}>
            <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
                <SelectValue placeholder="1小时" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="1h" className="rounded-lg">
                    1小时
                </SelectItem>
                <SelectItem value="6h" className="rounded-lg">
                    6小时
                </SelectItem>
                <SelectItem value="24h" className="rounded-lg">
                    24小时
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                    7天
                </SelectItem>
                <SelectItem value="14d" className="rounded-lg">
                    14天
                </SelectItem>
            </SelectContent>
        </Select>
    );
}

export function StatsRangeEvent() {
    const query = qs.parse(window.location.search.substring(1));

    const range = query?.['range'] ?? 'live';

    function handleSelect(value: string) {
        router.get(window.location.href, { range: value }, { preserveScroll: true, preserveState: true });
    }

    return (
        <Select value={range as string} onValueChange={handleSelect}>
            <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
                <SelectValue placeholder="直播期间" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="live" className="rounded-lg">
                    直播期间
                </SelectItem>
                <SelectItem value="1h" className="rounded-lg">
                    1小时
                </SelectItem>
                <SelectItem value="6h" className="rounded-lg">
                    6小时
                </SelectItem>
                <SelectItem value="24h" className="rounded-lg">
                    24小时
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                    7天
                </SelectItem>
                <SelectItem value="14d" className="rounded-lg">
                    14天
                </SelectItem>
            </SelectContent>
        </Select>
    );
}

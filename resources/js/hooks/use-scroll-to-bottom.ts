import { useCallback, useEffect, useRef, useState } from 'react';

export function useScrollToBottom() {
    const bottomRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const [isAtBottom, setIsAtBottom] = useState(true);

    const checkIfAtBottom = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) return false;

        const { scrollTop, scrollHeight, clientHeight } = viewport;
        const isBottom = scrollHeight - scrollTop - clientHeight < 10;

        setIsAtBottom(isBottom);
        return isBottom;
    }, []);

    const scrollToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({
                block: 'end',
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        viewport.addEventListener('scroll', checkIfAtBottom, { passive: true });

        return () => viewport.removeEventListener('scroll', checkIfAtBottom);
    }, [checkIfAtBottom]);

    return { bottomRef, viewportRef, isAtBottom, scrollToBottom };
}

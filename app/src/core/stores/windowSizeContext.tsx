import debounce from 'lodash.debounce';
import { createContext, ReactElement, useCallback, useEffect, useRef, useState } from 'react';

export interface WindowSize {
    height: number;
    width: number;
}

export interface WindowSizeContextValue {
    size: WindowSize;
}

const WindowSizeContext = createContext<undefined | WindowSizeContextValue>(undefined);

const WindowSizeProvider = ({ children }: { children: ReactElement | ReactElement[] }) => {
    const [size, setSize] = useState<WindowSize>({ height: 0, width: 0 });
    // comparison ref to avoid state delay race conditions
    const sizeRef = useRef<WindowSize>(size);

    const handleResize = useCallback(() => {
        const newSize = { height: window.innerHeight, width: window.innerWidth };
        if (newSize.height !== sizeRef.current.height || newSize.width !== sizeRef.current.width) {
            sizeRef.current = newSize;
            setSize(newSize);
        }
    }, []);

    useEffect(() => {
        const debouncedHandleResize = debounce(handleResize, 50);

        window.addEventListener('resize', debouncedHandleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', debouncedHandleResize);
        };
    }, [handleResize]);

    return <WindowSizeContext.Provider value={{ size }}>{children}</WindowSizeContext.Provider>;
};

export { WindowSizeContext, WindowSizeProvider };

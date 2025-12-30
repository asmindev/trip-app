import { useCallback, useRef } from 'react';

/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be debounced
 * @param wait The wait period in milliseconds
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(func: T, wait: number) {
    // Use a ref to store the timeout between renders
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    return useCallback(
        (...args: Parameters<T>) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = setTimeout(later, wait);
        },
        [func, wait],
    );
}

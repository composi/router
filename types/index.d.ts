/**
 * Creates a Router object.
 */
export function Router(): {
    (...path: {
        path: string;
        action: (param?: any) => void;
    }[]): void;
    /**
     * Removes specified handler for specified path.
     * Remeber that: one path can have multiple handlers/callbacks functions.
     * You should specify the exact object that refers to the handler.
     *
     * @param {string} path target path to remove.
     * @param {Function} fn handler function.
     * @returns {void} undefined
     */
    remove(path: string, fn: Function): void;
    /**
     * Removes all handlers and routes.
     *
     * @returns {void} undefined
     */
    removeAll(): void;
    /**
     * Navigates current route to desired one
     *
     * @param  {string} path target path to navigate
     * @returns {void} undefined
     */
    navigate(path: string): void;
    reload(): void;
};

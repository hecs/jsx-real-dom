import { getOrCreateHook } from "./hooks";

type ContextListener<T> = (T) => void;
type Context<T> = () => any;

export function createContext<T>(initialValue: T): Context<T> {
    let _context = initialValue;
    let listeners: ((T) => void)[] = [];
    const publish = (v) => {
        listeners.forEach((fn) => {
            if (fn !== undefined) {
                try {
                    (() => fn(v))();
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };

    const getResult = () => {
        return {
            data: _context,
            set: (updatedValue: T) => {
                _context = updatedValue;
                publish({ ..._context });
            },
            listen: (listener: ContextListener<T>) => {
                listeners.push(listener);
            },
        };
    };
    return getResult;
}

export function useContext<T>(context: Context<T>) {
    return getOrCreateHook((ctx) => {
        const { listen } = context();
        listen(() => {
            ctx.render();
        });
        return context;
    });
}

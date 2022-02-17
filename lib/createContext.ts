type ContextListener<T> = (T) => void;
type Context<T> = () => any;

export function createContext<T>(initialValue: T): Context<T> {
    let _context = initialValue;
    let listeners: ((T) => void)[] = [];
    const publish = (v) => {
        listeners.forEach((fn) => {
            try {
                (() => fn(v))();
            } catch (err) {}
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
    const currentContext = useContext.caller["_context"];
    if (currentContext.hookCount < (currentContext.hooks || []).length) {
        return currentContext.hooks[currentContext.hookCount++]();
    }
    const { listen } = context();
    listen(() => {
        currentContext.render();
    });
    currentContext.hookCount = currentContext.hooks.push(context);
    return context();
}

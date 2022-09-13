import { getOrCreateHook } from "./hooks/hooks";
import { pubsub } from "./utils/pubsub";

type ContextListener<T> = (T) => void;
type Context<T> = () => { data: T; set: (T) => void; listen: any };

export function createContext<T>(initialValue: T): Context<T> {
    let context = initialValue;
    const { pub, sub } = pubsub();

    const getResult = () => {
        return {
            data: { ...context },
            set: (updatedValue: T) => {
                context = updatedValue;
                pub(context);
            },
            listen: (listener: ContextListener<T>) => {
                sub(listener);
            },
        };
    };
    return getResult;
}

export function useContext<T>(context: Context<T>) {
    return getOrCreateHook((ctx) => {
        const { listen } = context();
        listen(ctx.render);
        return context;
    });
}

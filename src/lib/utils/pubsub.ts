import { safeRun } from "./helpers";

export type PubSubType = {
    pub: <T>(data: T) => void;
    sub: (fn: <T>(data: T) => void) => () => void;
};

export const pubsub = (listeners: (<T>(data: T) => void)[] = []): PubSubType => {
    return {
        pub: <T>(data: T) => {
            listeners.forEach((fn) => fn(data));
        },
        sub: (fn: <T>(data: T) => void) => {
            const safeFn = safeRun(fn);

            listeners.push(safeFn);

            return () => {
                listeners = listeners.filter((e) => e !== safeFn);
            };
        },
    };
};

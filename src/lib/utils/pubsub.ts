export type Publish<T extends Array<unknown>> = (...args: T) => unknown;
export type Subscriber<T extends Array<unknown>> = (...args: T) => unknown;
export type Subscribe<T extends Array<unknown>> = (fn: Subscriber<T>) => () => void;

export type PubSubType<T extends Array<unknown>> = [Publish<T>, Subscribe<T>];

export const pubsub = <T extends Array<unknown>>(): PubSubType<T> => {
    const listeners = new Set<Subscriber<T>>();
    return [
        (...data) => {
            listeners.forEach((fn) => {
                try {
                    fn(...data);
                } catch (err) {
                    console.warn(err);
                }
            });
        },
        (fn: (...data: T) => void) => {
            listeners.add(fn);

            return () => {
                listeners.delete(fn);
            };
        }
    ];
};

export type PubSubType<T> = {
    pub: (data: T) => void;
    sub: (fn: (data: T) => unknown) => () => void;
};

export const pubsub = <T>(): PubSubType<T> => {
    const listeners = new Set<(data: T) => unknown>();
    return {
        pub: (data: T) => {
            listeners.forEach((fn) => {
                try {
                    fn(data)
                }
                catch (err) {
                    console.warn(err);
                }
            });
        },
        sub: (fn) => {
            listeners.add(fn);
            return () => {
                listeners.delete(fn);
            };
        },
    };
};

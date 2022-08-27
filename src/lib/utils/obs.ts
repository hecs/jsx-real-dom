export type Observer<T> = (data: T, details?: { property: string; value: any }) => void;
export type RegisterObserver<T> = (cb: Observer<T>) => void;

export const makeObservable = <T extends object>(data: T): [T, RegisterObserver<T>] => {
    const listeners: Observer<T>[] = [];
    const onChange = (data) => {
        listeners.forEach((fn) => fn(result, data));
    };
    const result = new Proxy(data, {
        set(target, property, value) {
            if (target[property] !== value) {
                target[property] = value;
                onChange({ property, value });
                return true;
            }
            return false;
        },
    });
    const subscribe = (fn: Observer<T>) => {
        listeners.push(fn);
        if (result !== undefined) {
            fn(result);
        }
    };
    return [result, subscribe];
};
export const link =
    <T>(obs: RegisterObserver<T>, fn: (data: T, ...a) => void) =>
    (...arg) => {
        obs((data) => {
            fn(data, ...arg);
        });
    };

export const debounce = (fn: (...args) => unknown, time = 200) => {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(args);
        }, time);
    };
};

export function preventDefault<T extends Event>(fn: (e: T) => unknown) {
    return function (e: T) {
        fn.apply(this, [e]);
        e.stopPropagation();
        e.preventDefault();
    };
}

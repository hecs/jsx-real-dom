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

export const eventFactory = <E extends Event, R>(name: string, fn: (e: E) => R) => {
    return function (this: HTMLElement, e: E) {
        const detail = fn.apply(this, [e]);
        const event = new CustomEvent(name, { detail, bubbles: true })
        this.dispatchEvent(event);
    }
}

export const debounce = <T extends Array<unknown>>(fn: (...args: T) => unknown, time = 200) => {
    let timer;
    return (...args: T) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args as T);
        }, time);
    };
};

export function cancel<T extends Event>(e: T): T {
    e.stopPropagation();
    e.preventDefault();
    return e;
}

export function preventDefault<T extends Event>(fn: (e: T) => unknown) {
    return function (this: any, e: T) {
        fn.apply(this, [cancel(e)]);

    };
}

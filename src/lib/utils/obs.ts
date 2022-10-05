import { pubsub, Subscribe } from './pubsub';

export type ObserverDetails<T extends object> = undefined | { property: string | symbol | keyof T; value: unknown };

export type RegisterObserver<T extends object> = Subscribe<[T, ObserverDetails<T>]>;

export const makeObservable = <T extends object>(data: T): [T, RegisterObserver<T>] => {
    const [pub, sub] = pubsub<[T, ObserverDetails<T>]>();

    const result = new Proxy(data, {
        set(target, property, value) {
            if (target[property] !== value) {
                target[property] = value;
                pub(result, { property, value });
                return true;
            }
            return false;
        }
    });
    const addListener: RegisterObserver<T> = (fn) => {
        fn(result, undefined);
        return sub(fn);
    };

    return [result, addListener];
};

export const fromEvent = <T extends Event>(): [(Event)=>void,RegisterObserver<T>] =>{
    var [value, sub] = makeObservable<T>({} as T);
    return [(evt)=>{
        Object.assign(value,evt);
    },sub];
}

export const link = <T extends object, A extends Array<unknown>>(
    obs: RegisterObserver<T>,
    fn: (data: T, ...a: A) => void,
    filter?: (condition: T, details: ObserverDetails<T>) => boolean
) => (...arg: A) => {
    return obs((data, details) => {
        if (!filter || !details || filter(data, details)) {
            fn(data, ...arg);
        }
    });
};

export const multi = <T extends Array<unknown>>(...fns: Array<(...args: T) => unknown>) => {
    return (...args: T) => {
        fns.forEach((fn) => {
            fn(...args);
        });
    };
};

export const linkToHash = <T extends object>(state:[T, RegisterObserver<T>], excludeKeys:string[]=[]): [T, RegisterObserver<T>] => {
    const [data, onChange] = state;
    
    const validKeys = ([key]:[string,unknown])=>!excludeKeys.includes(key);

    const generateHash = (from:T) => {
        return Object.entries(from).filter(validKeys).reduce((all,[key,value])=>{
            return [...all, `${key}=${btoa(JSON.stringify(value))}`];
        },[] as string[]).join('&');
    } 

    const updateStateFromHash = () => {
        const hashState = location.hash.substring(1).split('&').map(d=>d.split('=')).reduce((s,[key,value])=>{
            return { ...s, [key]: JSON.parse(atob(value))};
        },{});
        
        Object.entries(hashState).filter(validKeys).forEach(([key,value])=>{
            const stateValue = data[key];
            if (JSON.stringify(value) != JSON.stringify(stateValue)) {
                data[key] = value;
            }
        })
    }
    if (location.hash.length > 1) {
        updateStateFromHash();
    }
    addEventListener('hashchange',()=>{
        updateStateFromHash()
    })
    
    onChange((data, details) => {
        location.hash = generateHash(data);
    })
    return state;
}

export const eventFactory = <E extends Event, R>(name: string, fn: (e: E) => R) => {
    return function (this: HTMLElement, e: E) {
        const detail = fn.apply(this, [e]);
        const event = new CustomEvent(name, { detail, bubbles: true });
        this.dispatchEvent(event);
    };
};

export const debounce = <T extends Array<unknown>>(fn: (...args: T) => unknown, time = 200) => {
    let timer;
    return (...args: T) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...(args as T));
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

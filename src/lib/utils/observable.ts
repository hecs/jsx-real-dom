export type TransformCallback<O> = (result: O) => void;
export type Transform<I, O> = (data: I, resolve: TransformCallback<O | I>) => void;
export type ObservedValueOf<I, O> = O extends Observable<I, infer T> ? T : never;

export class Observable<I, O> {
    _next: Observable<O, unknown>[] = [];
    input: I | undefined;
    output: O | undefined;
    transformer: Transform<I, O>;
    constructor(data?: I | undefined, transformFunction: Transform<I, O> = (d, r) => r(d)) {
        this.transformer = transformFunction.bind(this);
        if (data !== undefined) {
            this.emit(data);
        }
    }
    emit(data: I) {
        if (this.input !== data) {
            this.input = data;
            this.#onChange();
        }
        return this;
    }
    handleOutput(data: any, force: boolean = false) {
        if (force || (data != this.output && data !== undefined)) {
            this.output = data;
            this._next.forEach((next) => {
                next.emit(this.output!);
            });
        }
    }
    #onChange() {
        if (this.input !== undefined) {
            this.transformer(this.input, (result) => {
                this.handleOutput(result);
            });
        }
    }
    next<R>(n: Observable<O, R>) {
        this._next.push(n);
        if (this.output !== undefined) {
            n.emit(this.output);
        }
        return n;
    }
    // pipe<R>(f:Observable<O,R>, ...next: Observable<unknown, unknown>[]) {
    //     this.next(f).pipe(...next);
    //     let t: any = this;
    //     next.forEach((n) => {
    //         t = t.next(n);
    //     });
    //     return t;
    // }
    subscribe(fn: (data: O) => void) {
        this.next(
            new Observable<O, O>(undefined, (data, cb) => {
                fn(data);
                cb(data);
            })
        );
        return this;
    }
}

export const of = <I>(data: I | Promise<I>) => {
    return data instanceof Promise<I> ? map(() => data) : new Observable<I, I>(data);
};

export const tap = <I>(fn: (data: I) => void) =>
    new Observable<I, I>(undefined, (data) => {
        fn(data);
        return data;
    });

export const map = <I, O>(fn: (data: I) => O | Promise<O>) =>
    new Observable<I, O>(undefined, (data, cb) => {
        const r = fn(data);
        if (r instanceof Promise) {
            r.then(cb);
        } else {
            cb(r);
        }
    });

export const timer = <I extends any>(value: I, time: number = 300) => {
    const o = new Observable<I, I>();
    setTimeout(() => {
        o.emit(value);
    }, time);
    return o;
};

export const delay = <I>(time: number = 200) => {
    let timer;
    return new Observable<I, I>(undefined, (d, cb) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            cb(d);
        }, time);
    });
};

type ForkInput = {
    [key: string]: Observable<any, any>;
};

export const push = <A, B>(arg: Observable<any, B>) => {
    return new Observable<A, [A, B]>(undefined, function (a, resolve) {
        arg.subscribe((b) => {
            resolve([a, b]);
        });
    });
};

export const forkJoin = <T extends ForkInput, O extends { [key in keyof T]: any }>(parts: T) => {
    return new Observable<boolean, O>(true, function (_, resolve) {
        const checkComplete = () => {
            if (!Object.values(o).some((d) => d === undefined)) {
                resolve({ ...o } as O);
            }
        };

        const o = Object.entries(parts).reduce((sum, [key]) => {
            return { ...sum, [key]: undefined };
        }, {});

        Object.entries(parts).forEach(([key, value]) => {
            value.subscribe((v) => {
                o[key] = v;
                checkComplete();
            });
        });
    });
};

export const fromEvent = <T extends Event>(
    elm: HTMLElement | Window,
    evt: keyof HTMLElementEventMap | keyof WindowEventMap = "click"
) => {
    const obs = new Observable<T, T>();
    elm.addEventListener(evt, (e) => {
        obs.emit(e as T);
    });
    return obs;
};

export const empty = <T>() => new Observable<T, T>();

export const lnk =
    <T extends Event>(obs: Observable<T, T>) =>
    (e: T) => {
        obs.emit(e);
        e.stopPropagation();
        e.preventDefault();
    };

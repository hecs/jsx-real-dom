export class Observable<I, O> {
    _next: Observable<unknown, unknown>[] = [];
    input: any;
    output: any;
    transformer: (I) => O | Promise<O>;
    constructor(data?: I, transformFunction: (I) => O | Promise<O> = (_) => _) {
        this.transformer = transformFunction;
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
        if (force || data != this.output) {
            this.output = data;
            this._next.forEach((next) => {
                next.emit(this.output);
            });
        }
    }
    #onChange() {
        const result = this.transformer(this.input);
        //console.log("got result", result);
        if (result instanceof Promise) {
            result.then((o) => {
                this.handleOutput(o);
            });
        } else {
            this.handleOutput(result);
        }
    }
    next<R extends Observable<O, unknown>>(n: R) {
        this._next.push(n);
        if (this.output !== undefined) {
            n.emit(this.output);
        }
        return n;
    }
    pipe<R extends Observable<O, unknown>>(...next: R[]): R {
        let t: any = this;
        next.forEach((n) => {
            t = t.next(n);
        });
        return t;
    }
    subscribe(fn: (data: O) => unknown) {
        this.next(tap(fn));
        return this;
    }
}

export const of = <I>(data: I | Promise<I>) => {
    return data instanceof Promise<I>
        ? new Observable<unknown, I>(1, () => data)
        : new Observable<I, I>(data);
};

export const tap = <I>(fn: (data: I) => void) =>
    new Observable<I, I>(undefined, (data) => {
        fn(data);
        return data;
    });

export const map = <I, O>(fn: (data: I) => O | Promise<O>) => new Observable<I, O>(undefined, fn);

export const timer = <I extends any>(value: I, time: number = 300) => {
    const o = new Observable<I, I>();
    setTimeout(() => {
        o.emit(value);
    }, time);
    return o;
};

export const delay = <I>(time: number = 200) =>
    new Observable<I, I>(
        undefined,
        (d) =>
            new Promise((res) => {
                setTimeout(() => {
                    res(d);
                }, time);
            })
    );

export const forkJoin = <I extends unknown, O extends { [key: string]: any }>(parts: {
    [key: string]: Observable<unknown, unknown>;
}): Observable<unknown, O> => {
    return new Observable<boolean, O>(true, function (_: I) {
        const t = this;

        return new Promise<O>((_) => {
            const checkComplete = () => {
                if (!Object.values(o).some((d) => d === undefined)) {
                    t.handleOutput({ ...o } as O, false);
                }
            };

            const o = Object.entries(parts).reduce((sum, [key, value]) => {
                return { ...sum, [key]: undefined };
            }, {});
            Object.entries(parts).forEach(([key, value]) => {
                value.subscribe((v) => {
                    o[key] = v;
                    checkComplete();
                });
            });
        });
    });
};

export const fromEvent = <
    T extends
        | Event
        | ClipboardEvent
        | UIEvent
        | AnimationEvent
        | MouseEvent
        | InputEvent
        | FocusEvent,
    E extends HTMLElement
>(
    elm: E,
    evt: keyof HTMLElementEventMap = "click"
) => {
    const obs = new Observable<T, T>();
    elm.addEventListener(evt, (e: Event) => {
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

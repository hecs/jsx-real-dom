export class Observable<I, O> {
    _next: Observable<unknown, unknown>[] = [];
    input: any;
    output: any;
    transformer: (I) => O | Promise<O>;
    constructor(transformFunction: (I) => O | Promise<O> = (_) => _) {
        this.transformer = transformFunction;
    }
    emit(data: I) {
        if (this.input !== data) {
            this.input = data;
            this.#onChange();
        }
        return this;
    }
    handleOutput(data: any) {
        if (data != this.output) {
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
    addNext<R extends Observable<O, unknown>>(n: R) {
        this._next.push(n);
        if (this.output !== undefined) {
            n.emit(this.output);
        }
    }
    pipe<R extends Observable<O, unknown>>(...next: R[]): R {
        let t: any = this;
        next.forEach((n) => {
            t.addNext(n);
            t = n;
        });
        return t;
    }
    subscribe(fn: (data: O) => unknown) {
        this.addNext(tap(fn));
        return this;
    }
}

export const of = <I>(data: I) => new Observable<I, I>().emit(data);

export const tap = <I>(fn: (data: I) => void) =>
    new Observable<I, I>((data) => {
        fn(data);
        return data;
    });

export const map = <I, O>(fn: (data: I) => O) => new Observable<I, O>(fn);

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

export const lnk =
    <T extends Event>(obs: Observable<T, T>) =>
    (e: T) => {
        obs.emit(e);
        e.stopPropagation();
        e.preventDefault();
    };

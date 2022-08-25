export class Observable<I, O> {
    _next: Observable<O, unknown>[] = [];
    input: any;
    output: any;
    transformer: (I) => O | Promise<O>;
    constructor(transformFunction: (I) => O | Promise<O> = (_) => _) {
        this.transformer = transformFunction;
    }
    emit(data: any) {
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
    addNext(n: Observable<O, unknown>) {
        this._next.push(n);
        if (this.output !== undefined) {
            n.emit(this.output);
        }
    }
    pipe(...next: Observable<unknown, unknown>[]) {
        let t: Observable<unknown, unknown> = this;
        next.forEach((n) => {
            t.addNext(n);
            t = n;
        });
        return t;
    }
    subscribe(fn: (data: O) => void) {
        this.addNext(tap(fn));
    }
}

export const of = <I>(data: I) => new Observable<I, I>().emit(data);

export const tap = <I>(fn: (data: I) => void) =>
    new Observable<I, I>((data) => {
        fn(data);
        return data;
    });

export const map = <I, O>(fn: (data: I) => O) => new Observable<I, O>(fn);

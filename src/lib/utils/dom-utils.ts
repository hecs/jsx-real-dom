export const raf = <A extends Array<unknown>>(fn: (...arg: A) => unknown) => function (this: any, ...args: A) {
	return requestAnimationFrame(() => fn.apply(this, args))
};

export function getFormData<T extends { [key: string]: any }>(e: SubmitEvent): T {
	return Object.fromEntries(new FormData(targetAsElement<HTMLFormElement>(e))) as T;
}

export const asElement = <R extends HTMLElement>(node: Node | null | undefined) => node as R | undefined;

export const targetAsElement = <R extends HTMLElement>(e: Event) => {
	return asElement<R>(e.target as Node);
}

export const _q = <E extends Element>(selector: string, parent: HTMLElement | Document = document) => parent.querySelector<E>(selector)
export const _qa = <E extends Element>(selector: string, fn?: (elm: E, idx: number) => void, parent: HTMLElement | Document = document) => {
	const all = Array.from(parent.querySelectorAll<E>(selector));
	if (fn)
		all.forEach(fn);
	return all;
}
export const _qaListener = <T extends Event, E extends HTMLElement>(selector: string, evt: keyof HTMLElementEventMap, fn: (e: T, elm: E) => void, parent: HTMLElement | Document = document) => {
	return _qa(selector, (elm) => elm.addEventListener(evt, (e) => fn(e as T, elm as E)), parent);
}
export const _qListener = <T extends Event, E extends HTMLElement>(selector: string, evt: keyof HTMLElementEventMap, fn: (e: T, elm: E) => void, parent: HTMLElement | Document = document) => {
	const elm = _q(selector, parent);
	return elm?.addEventListener(evt, (e) => fn(e as T, elm as E));
}
export const _qId = <E extends HTMLElement>(id: string) => document.getElementById(id) as E | null
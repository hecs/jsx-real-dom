export const raf = <A extends Array<unknown>>(fn: (...arg: A) => unknown) => function (this: any, ...args: A) {
	return requestAnimationFrame(() => fn.apply(this, args))
};

export function getFormData<T extends { [key: string]: any }>(e: SubmitEvent): T {
	return Object.fromEntries(new FormData(targetAsElement<HTMLFormElement>(e))) as T;
}

export const asElement = <R extends HTMLElement>(node: Node | null) => node as R;

export const targetAsElement = <R extends HTMLElement>(e: Event) => {
	return asElement<R>(e.target as Node);
}
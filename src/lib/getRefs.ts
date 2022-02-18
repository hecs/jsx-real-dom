import { flattenDeep } from "./flatDeep-polyfill";

type HTMLElWithRef = HTMLElement & { ref?: string };

export function getRefs(
    el: HTMLElWithRef | HTMLElWithRef[],
    refs = {}
): { [key: string]: HTMLElement } {
    if (Array.isArray(el)) {
        el.forEach((_e) => getRefs(_e, refs));
        return refs;
    }
    const refKey = el.getAttribute("ref");
    if (refKey) refs[refKey] = refs[refKey] ? flattenDeep([refs[refKey], el]) : el;

    Array.from(el.children).forEach((c) => {
        getRefs(c as HTMLElWithRef, refs);
    });
    return refs;
}

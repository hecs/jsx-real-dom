import { Child } from "../createelement";
import { getRefsArray, HTMLElWithRef } from "../getRefs";

type HookState = {
    element?: Node;
    hooks: ((...args: any[]) => any)[];
    props: any;
    render: (props?: any) => void;
    [key: string]: any;
};

export const contextName = "_context";

const replaceElement = (elm: any, updatedElm: Child) => {
    if (typeof elm === "string") {
        return updatedElm;
    }
    if (elm?.parentNode && updatedElm) {
        elm.parentNode.replaceChild(updatedElm, elm);
        return updatedElm;
    }
    console.warn("could not update", elm, updatedElm);
    return elm;
};

export function getOrCreateHook(createFunction: (...args: any[]) => any, ...args) {
    const context = currentContext;
    if (context === undefined) {
        throw new Error("Hooks needs a bound context");
    }
    if (context.i < (context.hooks || []).length) {
        return context.hooks[context.i++](...args);
    }
    const hookFunction = createFunction(context, ...args);
    context.i = context.hooks.push(hookFunction);
    return hookFunction();
}

let currentContext;

const isFunction = (a) => typeof a === "function";

export function createBoundComponent(component: (props: any) => Child, props): Child {
    let element,
        d: any[] = [];
    const caller: HookState = {
        props,
        hooks: [],
        render: (attrs = {}) => {
            props = { ...props, ...(attrs || {}) };
            d.forEach((e) => e());
            element = replaceElement(element, render());
        },
    };

    const render = () => {
        caller.i = 0;
        currentContext = caller;
        const o = component(props) as HTMLElWithRef;
        if (o) {
            setTimeout(() => {
                d = getRefsArray(o)
                    .filter(({ ref }) => isFunction(ref))
                    .map(({ ref, el }) => ref(el))
                    .filter(isFunction);
            }, 0);

            o[contextName] = caller;
        }
        return o;
    };

    return (element = render());
}

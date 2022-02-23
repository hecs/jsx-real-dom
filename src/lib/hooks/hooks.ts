import { getRefsArray, HTMLElWithRef } from "../getRefs";

export const contextName = "_context";
type HookState = {
    element?: Node;
    hooks: ((...args: any[]) => any)[];
    props: any;
    render: (props?: any) => void;
    [key: string]: any;
};
const replaceElement = (elm: Node, updatedElm: Node) => {
    if (elm.parentNode && updatedElm) {
        elm.parentNode.replaceChild(updatedElm, elm);
        return updatedElm;
    }
    console.warn("could not update", elm, updatedElm);
    return elm;
};

export function getOrCreateHook(createFunction: (...args: any[]) => any, ...args) {
    const context = getOrCreateHook.caller.caller[contextName] as HookState;
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

export function createBoundComponent(component: (props: any) => Node, props): Node {
    let element;
    const caller: HookState = {
        props,
        hooks: [],
        render: (attrs) => {
            props = attrs || props;
            element = replaceElement(element, render());
        },
    };
    component[contextName] = caller;

    const render = () => {
        caller.i = 0;
        const o = component(props);
        if (o !== undefined) {
            setTimeout(() => {
                getRefsArray(o as HTMLElWithRef).forEach(({ ref, el }: any) => {
                    if (typeof ref === "function") {
                        ref(el);
                    }
                });
            }, 0);

            o[contextName] = caller;
        }
        return o;
    };

    return (element = render());
}

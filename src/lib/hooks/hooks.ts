import { Child } from "../createelement";
import { getRefsArray, HTMLElWithRef } from "../getRefs";

let currentContext;
export const contextName = "_context";
type HookState = {
    element?: any;
    hooks: ((...args: any[]) => any)[];
    props: any;
    render: (props?: any) => void;
    [key: string]: any;
};
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
    const context = currentContext as HookState;
    if (context === undefined) {
        throw new Error("Hooks needs a bound context");
    }
    if (context.i < (context.hooks || []).length) {
        return context.hooks[context.i++](...args);
    }
    const hookFunction = createFunction(context, ...args);
    context.i = context.hooks.push(hookFunction);
    return hookFunction(...args);
}

export function createBoundComponent(component: (props: any) => Child, props): Child {
    let element;
    const caller: HookState = {
        props,
        element,
        hooks: [],
        render: (attrs) => {
            element = replaceElement(element, render(attrs));
        },
    };
    component[contextName] = caller;

    const render = (attrs?) => {
        caller.i = 0;
        if (attrs) {
            caller.props = attrs;
        }
        currentContext = caller;
        const o = component(caller.props);
        if (o !== undefined) {
            setTimeout(() => {
                getRefsArray(o as HTMLElWithRef).forEach(({ ref, el }: any) => {
                    if (typeof ref === "function") {
                        ref(el);
                    }
                });
            }, 0);
            caller.element = o;
            o[contextName] = caller;
        }
        return o;
    };

    return (element = render());
}

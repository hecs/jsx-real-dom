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
            const [updatedElm, changed] = render(attrs);
            if (changed) {
                element = replaceElement(element, updatedElm);
            }
        },
    };
    component[contextName] = caller;

    const render = (attrs?) => {
        caller.i = 0;
        if (attrs) {
            caller.props = attrs;
        }
        if (element) {
            currentContext = element[contextName];
        } else currentContext = caller;
        const o = component(caller.props);
        if (o !== undefined) {
            if (caller.element && caller.element.innerHTML == (o as HTMLElement).innerHTML) {
                return [caller.element, false];
            } else {
                caller.element = o;
                o[contextName] = caller;
            }
            setTimeout(() => {
                getRefsArray(o as HTMLElWithRef).forEach(({ ref, el }: any) => {
                    if (typeof ref === "function") {
                        ref(el);
                    }
                });
            }, 0);
        }
        return [o, true];
    };

    return (element = render()[0]);
}

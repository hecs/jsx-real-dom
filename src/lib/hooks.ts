const contextName = "_context";
const disable = !!globalThis.ssr;
type HookState = {
    hooks: (() => any)[];
    props: any;
    render: () => void;
    [key: string]: any;
};
const replaceElement = (elm: Node, updatedElm: Node) => {
    if (elm.parentNode && updatedElm) {
        elm.parentNode?.replaceChild(updatedElm, elm);
        return updatedElm;
    }
    console.warn("could not update", elm, elm.parentNode, updatedElm);
    return elm;
};

export function getOrCreateHook(createFunction) {
    if (disable) {
        return () => {};
    }
    const context = getOrCreateHook.caller.caller[contextName];
    if (context === undefined) {
        throw new Error("Hooks needs a bound context");
    }
    if (context.hookCount < (context.hooks || []).length) {
        return context.hooks[context.hookCount++]();
    }
    const hookFunction = createFunction(context);
    context.hookCount = context.hooks.push(hookFunction);
    return hookFunction();
}

export function createBoundComponent(component, props): (Node | string)[] {
    let element;
    const caller: HookState = {
        props,
        element,
        hooks: [],
        render: () => {
            element = replaceElement(element, render());
        },
    };
    component[contextName] = caller;

    const render = () => {
        caller.hookCount = 0;
        return component(props);
    };

    return (element = render());
}

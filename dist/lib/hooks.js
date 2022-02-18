"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBoundComponent = exports.getOrCreateHook = void 0;
const contextName = "_context";
const disable = !!globalThis.ssr;
const replaceElement = (elm, updatedElm) => {
    var _a;
    if (elm.parentNode && updatedElm) {
        (_a = elm.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(updatedElm, elm);
        return updatedElm;
    }
    console.warn("could not update", elm, elm.parentNode, updatedElm);
    return elm;
};
function getOrCreateHook(createFunction) {
    if (disable) {
        return () => { };
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
exports.getOrCreateHook = getOrCreateHook;
function createBoundComponent(component, props) {
    let element;
    const caller = {
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
exports.createBoundComponent = createBoundComponent;

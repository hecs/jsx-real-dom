export function getOrCreateHook(createFunction) {
    const context = getOrCreateHook.caller.caller["_context"];
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

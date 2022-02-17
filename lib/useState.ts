export type StateResult<T> = [T, (T) => void, T];

export function useState<T>(initialValue: T): StateResult<T> {
    const currentContext = useState.caller["_context"];

    if (currentContext === undefined) {
        throw new Error("state must be called with context");
    }

    if (currentContext.hookCount < (currentContext.hooks || []).length) {
        return currentContext.hooks[currentContext.hookCount++]();
    }

    let currentValue: T = initialValue;
    const updateFunction = (update: T) => {
        if (currentValue !== update) {
            currentValue = update;
            currentContext.render();
        }
    };
    const result = (): StateResult<T> => {
        return [currentValue, updateFunction, initialValue];
    };
    currentContext.hookCount = currentContext.hooks.push(result);
    return result();
}

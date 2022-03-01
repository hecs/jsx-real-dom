import { getOrCreateHook } from "./hooks";

export type StateResult<T> = [T, (T) => void, T];

export function useState<T>(initialValue: T): StateResult<T> {
    return getOrCreateHook((ctx) => {
        let currentValue: T = initialValue;
        const updateFunction = (update: T) => {
            if (currentValue !== update) {
                currentValue = update;
                ctx.render();
            }
        };
        return (initialValue): StateResult<T> => {
            return [currentValue, updateFunction, initialValue];
        };
    },initialValue);
}

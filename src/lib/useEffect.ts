import { getOrCreateHook } from "./hooks";

const compareArray = (a, b) => {
    return JSON.stringify(a) == JSON.stringify(b);
};

export function useEffect(callback, values) {
    return getOrCreateHook((_) => {
        let lastValues;
        return () => {
            if (!compareArray(values, lastValues)) {
                callback();
                lastValues = values;
            }
        };
    });
}

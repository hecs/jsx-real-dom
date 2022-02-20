import { getOrCreateHook } from "./hooks";
import { compareArray } from "../utils/compareArrays";

export function useEffect(...args) {
    return getOrCreateHook((_) => {
        let lastValues;
        return (cb, values) => {
            if (!compareArray(values, lastValues)) {
                cb(values);
                lastValues = values;
            }
        };
    }, ...args);
}

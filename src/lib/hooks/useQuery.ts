import { getOrCreateHook } from "./hooks";
import { compareArray } from "../utils/compareArrays";

type QueryOptions = {
    enabled: boolean;
};

export function useQuery(fetchMethod: () => Promise<any>, keys: any[], options: QueryOptions) {
    return getOrCreateHook(
        (ctx) => {
            let lastValues, data, isLoading, error;
            return (promise, values, { enabled = true } = {}) => {
                if (!compareArray(values, lastValues) && !isLoading && enabled) {
                    isLoading = true;
                    lastValues = values;
                    promise()
                        .then((d) => {
                            data = d;
                        })
                        .catch((err) => {
                            console.error(err);
                            error = err;
                        })
                        .finally(() => {
                            isLoading = false;
                            ctx.render();
                        });
                }
                console.log("return", data, isLoading);
                return { isLoading, data, error };
            };
        },
        fetchMethod,
        keys,
        options
    );
}

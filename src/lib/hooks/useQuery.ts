import { getOrCreateHook } from "./hooks";
import { compareArray } from "../utils/compareArrays";

type QueryOptions = {
    enabled: boolean;
};

type QueryResultType = {
    data: any;
    isLoading: boolean;
    error?: Error;
};

export function useQuery(
    fetchMethod: () => Promise<any>,
    keys: any[],
    options: QueryOptions
): QueryResultType {
    return getOrCreateHook(
        (ctx, onFocus) => {
            let lastValues,
                data,
                isLoading = false,
                error;
            window.addEventListener("focus", () => {
                if (!isLoading) {
                    onFocus()
                        .then((d) => {
                            if (JSON.stringify(d) != JSON.stringify(data)) {
                                data = d;
                                ctx.render();
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            error = err;
                        });
                }
            });
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
                return { isLoading: isLoading === undefined ? true : isLoading, data, error };
            };
        },
        fetchMethod,
        keys,
        options
    );
}

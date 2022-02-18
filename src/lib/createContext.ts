import { getOrCreateHook } from "./hooks";

type ContextListener<T> = (T) => void;
type Context<T> = () => { data: T; set: (T) => void; listen: any };

// function attachMutationListener(obj, listener) {
//     const result = {};
//     Object.keys(obj).forEach((key) => {
//         Object.defineProperty(result, key, {
//             get: function () {
//                 return obj[key];
//             },
//             set: function (value) {
//                 console.log("set", value, key);
//                 if (obj[key] !== value) {
//                     listener(key, value, obj[key]);
//                     obj[key] = value;
//                 }
//             },
//         });
//     });
//     return result;
// }

export function createContext<T>(initialValue: T): Context<T> {
    let context = initialValue;
    // let context = attachMutationListener(initialValue, () => {
    //       setTimeout(() => {
    //           publish(context);
    //       }, 0);
    //   });

    let listeners: ((T) => void)[] = [];
    const publish = (v) => {
        listeners.forEach((fn) => {
            if (fn !== undefined) {
                try {
                    (() => fn(v))();
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };

    const getResult = () => {
        return {
            data: { ...context },
            set: (updatedValue: T) => {
                context = updatedValue;
                publish(context);
            },
            listen: (listener: ContextListener<T>) => {
                listeners.push(listener);
            },
        };
    };
    return getResult;
}

export function useContext<T>(context: Context<T>) {
    return getOrCreateHook((ctx) => {
        const { listen } = context();
        listen(() => {
            ctx.render();
        });
        return context;
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContext = exports.createContext = void 0;
const hooks_1 = require("./hooks");
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
function createContext(initialValue) {
    let context = initialValue;
    // let context = attachMutationListener(initialValue, () => {
    //       setTimeout(() => {
    //           publish(context);
    //       }, 0);
    //   });
    let listeners = [];
    const publish = (v) => {
        listeners.forEach((fn) => {
            if (fn !== undefined) {
                try {
                    (() => fn(v))();
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    };
    const getResult = () => {
        return {
            data: Object.assign({}, context),
            set: (updatedValue) => {
                context = updatedValue;
                publish(context);
            },
            listen: (listener) => {
                listeners.push(listener);
            },
        };
    };
    return getResult;
}
exports.createContext = createContext;
function useContext(context) {
    return (0, hooks_1.getOrCreateHook)((ctx) => {
        const { listen } = context();
        listen(() => {
            ctx.render();
        });
        return context;
    });
}
exports.useContext = useContext;

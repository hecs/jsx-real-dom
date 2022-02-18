"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useState = void 0;
const hooks_1 = require("./hooks");
function useState(initialValue) {
    return (0, hooks_1.getOrCreateHook)((ctx) => {
        let currentValue = initialValue;
        const updateFunction = (update) => {
            if (currentValue !== update) {
                currentValue = update;
                ctx.render();
            }
        };
        return () => {
            return [currentValue, updateFunction, initialValue];
        };
    });
}
exports.useState = useState;

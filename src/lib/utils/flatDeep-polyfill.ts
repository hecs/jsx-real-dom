// export function flattenDeep(arr) {
//     // Polyfill for array.flat(Infinity).
//     return arr.reduce(
//         (acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)),
//         []
//     );
// }

Array.prototype.flat = function (maxDepth, currentDepth = 0) {
    return currentDepth < maxDepth
        ? this.reduce(
              (a, v) => a.concat(Array.isArray(v) ? v.flat(maxDepth, currentDepth + 1) : v),
              []
          )
        : this;
};

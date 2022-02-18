export function flattenDeep(arr) {
    // Polyfill for array.flat(Infinity).
    return arr.reduce(
        (acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)),
        []
    );
}

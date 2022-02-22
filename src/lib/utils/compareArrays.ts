export const compareArray = (a, b) => {
    if (a === b) {
        return true;
    }
    if ((a === undefined && b !== undefined) || (b === undefined && a !== undefined)) {
        return false;
    }
    return (
        JSON.stringify(a.filter((i) => i !== undefined)) ==
        JSON.stringify(b.filter((i) => i !== undefined))
    );
};

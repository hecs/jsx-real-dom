export const safeRun = <R extends unknown, T extends Array<unknown>>(fn: (...args: T) => R) => (...args: T) => R => {
	try {
		return fn(...args)
	}
	catch (err) {
		console.warn(err);
	}
	return undefined;
}

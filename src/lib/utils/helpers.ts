type SafeFn<T extends Array<unknown>, R> = (...args: T) => R;

export const safeRun = <R extends unknown, T extends Array<unknown>>(fn: SafeFn<T, R>): SafeFn<T, R | undefined> => (...args: T) => {
	try {
		return fn(...args as T) as R;
	}
	catch (err) {
		console.warn(err);
	}
	return undefined;
}

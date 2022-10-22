import { makeObservable } from "./obs";

type QueryOptions = {};

type Result<T> = {
	loading: boolean;
	result: T | Error | undefined;
};

export const query = <R>(fn: () => Promise<R | undefined>, opt?: QueryOptions) => {
	const [state, onChange] = makeObservable<Result<R>>({
		result: undefined,
		loading: true,
	});
	fn()
		.catch((err) => {
			return err;
		})
		.then((value) => {
			state.result = value;
		})
		.finally(() => {
			state.loading = false;
		});
	return onChange;
};

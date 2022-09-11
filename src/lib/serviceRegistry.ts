
const registry = {}

export const fromModule = <T>(url: string) => import(url) as Promise<T>;

export const registerSingleton = <T>(name: string, init: (() => Promise<T>)) => {
	registry[name] = { init }
}

export const getService = <T>(name: string): Promise<T> => {
	const service = registry[name];
	if (service) {
		return (service.instance) ?
			Promise.resolve(service.instance)
			: service.init().then(d => {
				service.instance = d;
				return d;
			});
	}
	throw new Error(`${name} not registered`);
}

export const provide = (fn: (...args: unknown[]) => void, ...args: string[]): Promise<void> => {
	return Promise.all(args.map(getService)).then((services) => {
		fn(services);
	})
}
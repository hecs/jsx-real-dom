export function time<T>(name: string, fetchData: () => Promise<T>, render: (data: T) => unknown) {
	const [start, fetched, renderd, total] = [`${name}-start`, `${name}-fetched`, `${name}-rendered`, `${name}-total`]
	performance?.mark(start);
	return fetchData().then(d => {
		performance?.mark(fetched);
		render(d)
		performance?.mark(renderd);
		performance?.measure(renderd, fetched, renderd)
		performance?.measure(total, start, renderd)
	})
}
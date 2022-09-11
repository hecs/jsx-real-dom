import { h } from "../createelement";

export const loadStyle = (href: string) => new Promise((res) => {
	document.head.append(
		h(
			"link",
			{ rel: "stylesheet", href }
		) as Node
	);
	res(true);
})

export const loadScript = (src: string, type = 'text/javascript') => new Promise(res => {
	document.head.append(h('script', { type, src, defer: true }) as Node)
	res(true);
});
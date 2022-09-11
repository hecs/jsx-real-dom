export function getCookies(cookie = document.cookie): any {
	return decodeURIComponent(cookie)
		.split(";")
		.map((v) => v.trim().split("="))
		.reduce((a, [key, value]) => ({ ...a, [key.trim()]: value?.trim() }), {});
}

export function removeCookie(name: string) {
	document.cookie = `${name}=;path=/;Max-Age=-1`;
}
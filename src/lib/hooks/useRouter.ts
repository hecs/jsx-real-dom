import { getOrCreateHook } from "./hooks";

let routes: any[] = [];

let hasListener = false;

const byLength = (a, b) => a.match.length - b.match.length;

const matchRoute =
    (path) =>
    ({ match }) =>
        path.includes(match);

export function useRouter(match: string) {
    return getOrCreateHook((ctx) => {
        console.log("create hook", ctx);
        const matchRoutes = () => {
            const path = window.location.hash.substring(1);
            routes
                .sort(byLength)
                .filter(matchRoute(path))
                .forEach(({ render }) => {
                    setTimeout(() => {
                        render();
                    }, 0);
                });
        };

        if (!hasListener) {
            hasListener = true;
            window.addEventListener("popstate", (e) => {
                matchRoutes();
            });
        }
        console.log("new route");
        if (ctx && ctx.render) {
            const route = { render: ctx.render, match };
            if (!routes.includes(route)) {
                routes.push(route);
            }
        }
        const startHash = window.location.hash;
        return (match) => {
            console.log(routes, match, startHash);
            const path = window.location.hash.substring(1);

            return { path };
        };
    }, match);
}

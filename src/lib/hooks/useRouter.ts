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
        const matchRoutes = () => {
            const path = window.location.hash.substring(1);
            routes
                .sort(byLength)
                .filter(matchRoute(path))
                .forEach(({ ctx }) => {
                    console.log(ctx);
                    setTimeout(() => {
                        ctx.render();
                    }, 0);
                });
        };

        if (!hasListener) {
            hasListener = true;
            window.addEventListener("popstate", (e) => {
                matchRoutes();
            });
        }

        routes.push({ ctx, match });
        const startHash = window.location.hash;
        return (match) => {
            console.log(routes, match, startHash);
            const path = window.location.hash.substring(1);

            return { path };
        };
    }, match);
}

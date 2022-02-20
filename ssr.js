import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import { JSDOM } from "jsdom";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname);
const srcDir = path.join(__dirname, "src");

const cache = {};

function uint8arrayToStringMethod(myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr);
}

let envPlugin = {
    name: "env",
    setup(build) {
        // Intercept import paths called "env" so esbuild doesn't attempt
        // to map them to a file system location. Tag them with the "env-ns"
        // namespace to reserve them for this plugin.
        build.onResolve({ filter: /^props$/ }, (args) => {
            return { path: args.path, namespace: "serverProps" };
        });

        // Load paths tagged with the "env-ns" namespace and behave as if
        // they point to a JSON file containing the environment variables.
        build.onLoad({ filter: /.*/, namespace: "serverProps" }, () => ({
            contents: JSON.stringify({ apa: "hej" }),
            loader: "json",
        }));
    },
};

const loadUrl = (pathname) =>
    new Promise((res, _) => {
        if (cache[pathname]) {
            res(cache[pathname]);
        } else {
            const isInject = pathname.includes("/inject");
            const fileName = pathname.replace("/inject", "");
            console.log("file", fileName);

            //const c = fs.readFileSync(path.join(buildDir, fileName + ".js")).toString();
            esbuild
                .build({
                    minify: true,
                    bundle: true,
                    treeShaking: true,
                    keepNames: true,
                    plugins: [envPlugin],
                    inject: ["module.js"],
                    platform: "node",
                    tsconfig: "tsconfig.ssr.json",
                    entryPoints: ["./src" + fileName + ".jsx"],
                    jsx: "transform",
                    jsxFactory: "h",
                    write: false,
                    jsxFragment: "Fragment",
                })
                .then(({ outputFiles }) => {
                    const js = uint8arrayToStringMethod(outputFiles[0].contents);

                    const dom = new JSDOM(`<html><body></body></html>`, {
                        url: "https://react.js",
                        runScripts: "dangerously",
                        includeNodeLocations: true,
                    });
                    const {
                        window: { document: doc, addEventListener },
                    } = dom;
                    addEventListener("ssrdone", (e) => {
                        if (dom.window.loadProps) {
                            console.log("hoho", dom.window.loadProps());
                        }
                        const result = e.target.innerHTML + `<script>${js}</script>`;

                        //cache[pathname] = result;
                        res(result);
                    });
                    const scriptElm = doc.createElement("script");
                    scriptElm.innerHTML = js;
                    doc.body.appendChild(scriptElm);
                });
        }
    });

const httpServer = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);
    if (pathname.includes(".ico")) {
        res.writeHead(404);
        res.end();
        return;
    }
    loadUrl(pathname).then((d) => {
        res.writeHead(d ? 200 : 404);
        res.end(d);
    });
});

httpServer.listen(8080);

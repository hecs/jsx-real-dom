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

const loadUrl = (pathname) =>
    new Promise((res, _) => {
        if (cache[pathname]) {
            res(cache[pathname]);
        } else {
            const isInject = pathname.includes("/inject");
            const fileName = pathname.replace("/inject", "");

            //const c = fs.readFileSync(path.join(buildDir, fileName + ".js")).toString();
            esbuild
                .build({
                    minify: true,
                    bundle: true,
                    platform: "node",
                    tsconfig: "tsconfig.ssr.json",
                    entryPoints: ["./src" + fileName + ".jsx"],
                    jsx: "transform",
                    jsxFactory: "h",
                    write: false,
                    jsxFragment: "Fragment",
                })
                .then((script) => {
                    const js = uint8arrayToStringMethod(script.outputFiles[0].contents);
                    console.log("script", js);
                    const dom = new JSDOM(
                        `<html><body><div id="app"></div></body></html><script>${js}</script>`,
                        {
                            url: "https://react.js",
                            runScripts: "dangerously",
                            includeNodeLocations: true,
                        }
                    );
                    //dom.window.document.addEventListener("error", console.log);
                    dom.window.document.addEventListener("load", () => {
                        const result = isInject
                            ? dom.window.document.getElementById("app").innerHTML +
                              `<script>${js}</script>`
                            : dom.window.document.body.innerHTML;
                        cache[pathname] = result;
                        res(result);
                    });
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

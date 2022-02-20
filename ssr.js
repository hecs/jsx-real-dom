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
            console.log("file", fileName);

            //const c = fs.readFileSync(path.join(buildDir, fileName + ".js")).toString();
            esbuild
                .build({
                    minify: true,
                    bundle: true,
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
                        const result = isInject
                            ? e.target.innerHTML + `<script>${js}</script>`
                            : doc.body.innerHTML;
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

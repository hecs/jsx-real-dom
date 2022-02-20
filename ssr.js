import http from "http";
import url from "url";
import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import { JSDOM } from "jsdom";
// import { parse } from "@babel/parser";
// import {parse, find, findInfo} from "ast-parser";

//const __filename = url.fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//const buildDir = path.join(__dirname);
//const srcDir = path.join(__dirname, "src");

function getNode(code) {
    return parse(code, {
        sourceType: "module",
        plugins: ["classProperties", "typescript"],
    });
}

const cache = {};

function uint8arrayToStringMethod(myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr);
}

// let envPlugin = {
//     name: "env",
//     setup(build) {
//         // Intercept import paths called "env" so esbuild doesn't attempt
//         // to map them to a file system location. Tag them with the "env-ns"
//         // namespace to reserve them for this plugin.
//         build.onResolve({ filter: /^props$/ }, (args) => {
//             return { path: args.path, namespace: "serverProps" };
//         });

//         // Load paths tagged with the "env-ns" namespace and behave as if
//         // they point to a JSON file containing the environment variables.
//         build.onLoad({ filter: /.*/, namespace: "serverProps" }, () => ({
//             contents: JSON.stringify({ apa: "hej" }),
//             loader: "json",
//         }));
//     },
// };

const transformJs = (js, props) => {
    const result = esbuild.transformSync(
        `
    const module={};
    ${js}
    console.log('this',this);
    const root = document.getElementById('__root');
    root.innerHTML = '';
    root.append(module.exports.default(${JSON.stringify(props)}));
    `,
        {
            minify: true,
            treeShaking: true,
            keepNames: true,
        }
    );
    console.log(result);
    return result.code;
};

const loadUrl = (pathname) =>
    new Promise((res, _) => {
        if (cache[pathname]) {
            res(cache[pathname]);
        } else {
            //const isInject = pathname.includes("/inject");
            const fileName = pathname;
            console.log("file", fileName);

            //const c = fs.readFileSync(path.join(buildDir, fileName + ".js")).toString();
            esbuild
                .build({
                    minify: true,
                    bundle: true,
                    treeShaking: true,
                    keepNames: true,
                    platform: "node",
                    tsconfig: "tsconfig.ssr.json",
                    entryPoints: ["./src/pages" + fileName + ".jsx"],
                    jsx: "transform",
                    jsxFactory: "h",
                    write: false,
                    jsxFragment: "Fragment",
                })
                .then((result) => {
                    const dom = new JSDOM(`<html><body></body></html>`, {
                        url: "https://react.js",
                        runScripts: "dangerously",
                        includeNodeLocations: true,
                    });
                    const {
                        window: { document: doc, addEventListener },
                    } = dom;

                    const { outputFiles } = result;
                    const js = outputFiles[0].text;

                    // const node = getNode(js);
                    // console.log(node.program.body);
                    var module = (globalThis.module = {});

                    eval(js);
                    const props = module.exports.loadProps();
                    // console.log(props);
                    // const page = module.exports.default.apply(dom.window, [props]);
                    // res("hej", page);

                    addEventListener("ssrdone", (e) => {
                        const result = `${e.target.innerHTML}<script>${transformJs(
                            js,
                            props
                        )}</script>`;

                        //cache[pathname] = result;
                        res(result);
                    });
                    const scriptElm = doc.createElement("script");
                    scriptElm.innerHTML = `
                        const module={};
                        ${js}
                        const props = module.exports.loadProps();
                        const root = document.createElement('div');
                        root.setAttribute('id', '__root');
                        document.body.append(root)
                        root.append(module.exports.default(props));
                        root.dispatchEvent(new Event('ssrdone', { bubbles: true }))`;
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

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const componentsDir = "./dist/example";

const httpServer = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url, true);
    if (pathname.includes(".ico")) {
        res.writeHead(404);
        res.end();
        return;
    }
    res.writeHead(200);

    const dom = new JSDOM("<html><body></body></html>", {
        url: "https://dev.wue-theme.test",
    });
    dom.window.addEventListener("load", () => {
        res.end(dom.window.document.body.innerHTML);
    });
    (() => {
        customElements = dom.window.customElements;
        HTMLElement = dom.window.HTMLElement;
        document = dom.window.document;
        console.log("load", `${componentsDir}${pathname}.js`);
        const component = require(`${componentsDir}${pathname}.js`);
        if (component && component.default) {
            console.log(component);
            component.default({ items: ["a", "b", "c", "d", "e", "f"] });
        }
    })();
});

httpServer.listen(8080);

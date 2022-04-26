var brotliSize = require("brotli-size");
var fs = require("fs");

let result = {};
let total = 0;

console.log("Minified & brotli-compressed (as standalone bundles, so numbers can be misleading):");

fs.readdirSync("dist").forEach((f) => {
    var str = fs.readFileSync("dist/" + f).toString();
    const compressedSize = brotliSize.sync(str);
    total += compressedSize;
    result[f] = compressedSize;
});

console.table({ ...result, Total: total });

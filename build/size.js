var brotliSize = require("brotli-size");
var fs = require("fs");

var str = fs.readFileSync("temp/sizetest.js").toString();
const compressedSize = brotliSize.sync(str);

console.info("Minified & brotli-compressed bundle size:", compressedSize);

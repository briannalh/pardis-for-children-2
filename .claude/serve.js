const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.argv[2] || 5173);
const dir = path.join(__dirname, "..", process.argv[3] || ".");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(dir, urlPath);
    if (!filePath.startsWith(dir)) {
      res.writeHead(403).end("Forbidden");
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
        "X-Robots-Tag": "noindex, nofollow",
      });
      res.end(data);
    });
  })
  .listen(port, () => console.log("Serving " + dir + " on http://localhost:" + port));

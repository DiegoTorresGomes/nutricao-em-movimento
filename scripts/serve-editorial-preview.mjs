// Small read-only static server bound to loopback; no CMS or database routes.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, relative, extname, sep } from "node:path";

const previews = resolve("docs/editorial/validacao-cms/previas");
const staticRoot = resolve(".next/static");
const publicRoot = resolve("public");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2", ".woff": "font/woff", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif" };
const server = createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1:4182").pathname);
    let root, path;
    if (["/", "/index.html", "/comer-por-emocao.html", "/alimentacao-consciente.html"].includes(pathname)) {
      root = previews; path = pathname === "/" ? "index.html" : pathname.slice(1);
    } else if (pathname.startsWith("/_next/static/")) {
      root = staticRoot; path = pathname.slice("/_next/static/".length);
    } else if (pathname.startsWith("/images/")) {
      root = publicRoot; path = pathname.slice(1);
    } else { res.writeHead(404); res.end(); return; }
    const file = resolve(root, path);
    const within = relative(root, file);
    const type = types[extname(file)];
    if (!within || within === ".." || within.startsWith(".." + sep) || !type || !(await stat(file)).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Content-Length": body.length });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch { res.writeHead(404); res.end(); }
});
const port = Number(process.env.EDITORIAL_PREVIEW_PORT ?? 4182);
server.listen(port, "127.0.0.1", () => console.log(`Prévia sem banco: http://127.0.0.1:${server.address().port}/ — encerre com Ctrl+C`));

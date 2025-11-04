const http = require('http');
const fs = require('fs');
const path = require('path');
const qunit = require('node-qunit-puppeteer');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8021;

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.map': return 'application/json';
    case '.json': return 'application/json; charset=utf-8';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    case '.otf': return 'font/otf';
    default: return 'application/octet-stream';
  }
}

function createServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(ROOT, urlPath);
    try {
      const resolved = path.resolve(filePath);
      if (!resolved.startsWith(ROOT)) {
        res.statusCode = 403;
        return res.end('Forbidden');
      }
      let stat;
      try {
        stat = fs.statSync(resolved);
      } catch (e) {
        res.statusCode = 404;
        return res.end('Not found');
      }
      if (stat.isDirectory()) {
        filePath = path.join(resolved, 'index.html');
      } else {
        filePath = resolved;
      }
      res.setHeader('Content-Type', contentType(filePath));
      fs.createReadStream(filePath).pipe(res);
    } catch (e) {
      res.statusCode = 500;
      res.end(String(e));
    }
  });
  return new Promise(resolve => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  let server;
  try {
    server = await createServer();
    const targetUrl = `http://127.0.0.1:${PORT}/test/test-smartart-navbar.html`;
    const result = await qunit.runQunitPuppeteer({
      targetUrl,
      timeout: 30000,
      redirectConsole: true,
      puppeteerArgs: ['--no-sandbox']
    });
    console.log(`SmartArt Navbar tests: ${result.stats.passed}/${result.stats.total} passed in ${result.stats.runtime}ms`);
    if (result.stats.failed > 0) {
      qunit.printFailedTests(result, console);
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    if (server) server.close();
  }
})();

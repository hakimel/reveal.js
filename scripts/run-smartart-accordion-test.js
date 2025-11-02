const qunit = require('node-qunit-puppeteer');
const path = require('path');
const connect = require('gulp-connect');

(async () => {
  const root = '.';
  const server = connect.server({ root, port: 8010, host: 'localhost', name: 'smartart-acc-test' });

  try {
    const targetUrl = `http://localhost:8010/test/test-smartart-accordion.html`;
    const result = await qunit.runQunitPuppeteer({
      targetUrl,
      timeout: 30000,
      redirectConsole: true,
      puppeteerArgs: ['--no-sandbox']
    });

    if (result.stats.failed > 0) {
      console.error(`Failed: ${result.stats.failed}/${result.stats.total}`);
      qunit.printFailedTests(result, console);
      process.exitCode = 1;
    } else {
      console.log(`Passed ${result.stats.passed}/${result.stats.total} in ${result.stats.runtime}ms`);
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();

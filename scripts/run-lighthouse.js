import { spawn } from 'child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Starting preview server...');
  const server = spawn('bun', ['run', 'preview'], {
    stdio: 'pipe',
    shell: true,
  });

  let serverStarted = false;

  // Wait for server to start
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const output = data.toString();
      // console.log(`[Server]: ${output}`);
      if (output.includes('localhost:') || output.includes('http://')) {
        serverStarted = true;
        resolve();
      }
    });

    server.stderr.on('data', (data) => {
      // console.error(`[Server Error]: ${data.toString()}`);
    });
  });

  if (!serverStarted) {
    console.error('Server failed to start');
    server.kill();
    process.exit(1);
  }

  console.log('Server started. Launching Chrome and Lighthouse...');

  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  // Run Lighthouse
  const runnerResult = await lighthouse('http://localhost:4321/', options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lighthouse-report.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
  console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);
  console.log(
    'Best Practices score was',
    runnerResult.lhr.categories['best-practices'].score * 100
  );
  console.log('SEO score was', runnerResult.lhr.categories.seo.score * 100);

  const reportJson = JSON.stringify(runnerResult.lhr, null, 2);
  fs.writeFileSync('lighthouse-report.json', reportJson);

  await chrome.kill();
  server.kill();

  // Force exit to ensure server process dies
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

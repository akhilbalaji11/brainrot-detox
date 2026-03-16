const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { chromium } = require("playwright");

const extensionPath = path.resolve(__dirname, "..", "dist");
const userDataDir = path.join(os.tmpdir(), "brainrot-detox-playwright-profile");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

function getBrowserExecutable() {
  const executablePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));
  assert.ok(executablePath, "Could not find a local Chrome or Edge executable for extension testing.");
  return executablePath;
}

function getShortsHtml() {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Shorts Harness</title>
      <style>
        html, body { margin: 0; min-height: 100%; background: #111; color: #fff; font-family: sans-serif; }
        ytd-shorts { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        video { width: 360px; height: 640px; background: #333; display: block; }
      </style>
    </head>
    <body>
      <ytd-shorts>
        <video class="html5-main-video" muted autoplay playsinline></video>
      </ytd-shorts>
    </body>
  </html>`;
}

function getTikTokHtml() {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>TikTok Harness</title>
      <style>
        html, body { margin: 0; min-height: 100%; background: #000; color: #fff; font-family: sans-serif; }
        .tiktok-web-player { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        video { width: 400px; height: 700px; background: #222; display: block; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="tiktok-web-player">
        <video muted autoplay playsinline poster="poster-0"></video>
      </div>
    </body>
  </html>`;
}

function getInstagramHtml() {
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Instagram Harness</title>
      <style>
        html, body { margin: 0; min-height: 100%; background: #111; color: #fff; font-family: sans-serif; }
        main, [role="presentation"] { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        video { width: 360px; height: 640px; background: #333; display: block; }
      </style>
    </head>
    <body>
      <main>
        <div role="presentation">
          <video muted autoplay playsinline></video>
        </div>
      </main>
    </body>
  </html>`;
}

async function waitForWidget(page) {
  await page.waitForFunction(() => {
    const host = document.getElementById("brd-overlay-host");
    return !!host?.shadowRoot?.querySelector(".brd-widget");
  }, { timeout: 10000 });
}

async function getWidgetStyles(page) {
  return page.evaluate(() => {
    const widget = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(".brd-widget");
    if (!widget) return null;
    return {
      left: widget.style.left,
      right: widget.style.right,
      bottom: widget.style.bottom,
    };
  });
}

async function getWidgetMarker(page) {
  return page.evaluate(() => {
    const widget = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(".brd-widget");
    if (!widget) return null;
    if (!widget.dataset.marker) {
      widget.dataset.marker = Math.random().toString(36).slice(2);
    }
    return widget.dataset.marker;
  });
}

async function getOverlayMarker(page, overlayName) {
  return page.evaluate((name) => {
    const overlay = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(`[data-overlay="${name}"]`);
    if (!overlay) return null;
    if (!overlay.dataset.marker) {
      overlay.dataset.marker = Math.random().toString(36).slice(2);
    }
    return overlay.dataset.marker;
  }, overlayName);
}

async function hasOverlay(page, overlayName) {
  return page.evaluate((name) => {
    return !!document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(`[data-overlay="${name}"]`);
  }, overlayName);
}

async function getWidgetScore(page) {
  return page.evaluate(() => {
    const score = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(".brd-widget-score");
    return score ? Number(score.textContent || "0") : null;
  });
}

async function clickWidget(page) {
  const box = await page.evaluate(() => {
    const widget = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(".brd-widget");
    if (!widget) return null;
    const rect = widget.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  assert.ok(box, "Expected widget box to exist.");
  await page.mouse.click(box.x, box.y);
}

async function dragWidget(page, targetX) {
  const box = await page.evaluate(() => {
    const widget = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector(".brd-widget");
    if (!widget) return null;
    const rect = widget.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  });
  assert.ok(box, "Expected widget box to exist.");

  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  await page.mouse.move(targetX, box.y - 40, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(250);
}

async function closeVibeCheck(page) {
  await page.evaluate(() => {
    const button = document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector("[data-overlay='vibecheck'] [data-action='skip']");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

async function pushShortsNavigation(page, nextIndex) {
  await page.evaluate((index) => {
    history.pushState({}, "", `/shorts/${index}`);
    document.body.appendChild(document.createElement("div"));
  }, nextIndex);
}

async function measureShortsVelocity(page, delayMs, navigationCount = 20) {
  await page.goto("https://www.youtube.com/shorts/start", { waitUntil: "domcontentloaded" });
  await waitForWidget(page);

  for (let index = 1; index <= navigationCount; index++) {
    await pushShortsNavigation(page, index);
    await page.waitForTimeout(delayMs);
  }

  await page.waitForTimeout(800);
  const score = await getWidgetScore(page);
  assert.ok(score !== null, "Expected Shorts widget score to be readable.");
  return score;
}

async function verifyShortsVelocity(context) {
  const slowPage = await context.newPage();
  const slowScore = await measureShortsVelocity(slowPage, 900);
  await slowPage.close();

  const fastPage = await context.newPage();
  const fastScore = await measureShortsVelocity(fastPage, 160);
  await fastPage.close();

  assert.ok(
    fastScore > slowScore + 6,
    `Rapid Shorts navigation should score materially higher than slow navigation (slow=${slowScore}, fast=${fastScore}).`
  );
}

async function driveShortsScenario(page) {
  await page.goto("https://www.youtube.com/shorts/start", { waitUntil: "domcontentloaded" });
  await waitForWidget(page);

  const widgetMarker = await getWidgetMarker(page);
  await dragWidget(page, 20);
  let styles = await getWidgetStyles(page);
  assert.equal(styles?.left, "0px", "Widget should snap to the left edge after dragging.");

  await clickWidget(page);
  await page.waitForFunction(() => !!document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector("[data-overlay='vibecheck']"), { timeout: 5000 });
  await closeVibeCheck(page);
  await page.waitForFunction(() => !document.getElementById("brd-overlay-host")?.shadowRoot?.querySelector("[data-overlay='vibecheck']"), { timeout: 5000 });

  await dragWidget(page, 1200);
  styles = await getWidgetStyles(page);
  assert.equal(styles?.right, "0px", "Widget should snap back to the right edge after dragging.");

  let interventionMarker = null;
  let skyrimMarker = null;
  let nextIndex = 1;

  for (; nextIndex <= 80; nextIndex++) {
    await pushShortsNavigation(page, nextIndex);
    await page.waitForTimeout(320);

    if (!interventionMarker && await hasOverlay(page, "intervention")) {
      interventionMarker = await getOverlayMarker(page, "intervention");
    }

    if (await hasOverlay(page, "skyrim")) {
      skyrimMarker = await getOverlayMarker(page, "skyrim");
      break;
    }
  }

  const scoreBeforeSkyrimAssertion = await getWidgetScore(page);
  assert.ok(
    skyrimMarker,
    `Expected Skyrim overlay after rapid Shorts navigation, current score was ${scoreBeforeSkyrimAssertion}.`
  );

  if (interventionMarker) {
    const interventionMarkerAfter = await getOverlayMarker(page, "intervention");
    assert.equal(
      interventionMarkerAfter,
      interventionMarker,
      "Intervention overlay should stay mounted while the widget keeps updating."
    );
  }

  for (let index = nextIndex + 1; index <= nextIndex + 4; index++) {
    await pushShortsNavigation(page, index);
    await page.waitForTimeout(320);
  }

  await page.waitForTimeout(1200);
  const skyrimMarkerAfter = await getOverlayMarker(page, "skyrim");
  const widgetMarkerAfter = await getWidgetMarker(page);
  assert.equal(skyrimMarkerAfter, skyrimMarker, "Skyrim overlay should stay mounted while the widget keeps updating.");
  assert.equal(widgetMarkerAfter, widgetMarker, "Widget should update in place instead of remounting.");
}

async function driveTikTokScenario(page) {
  await page.goto("https://www.tiktok.com/", { waitUntil: "domcontentloaded" });
  await waitForWidget(page);

  const widgetMarker = await getWidgetMarker(page);
  await page.evaluate(() => {
    history.pushState({}, "", "/following");
    document.body.appendChild(document.createElement("div"));
  });
  await page.waitForTimeout(500);
  const widgetMarkerAfterRoute = await getWidgetMarker(page);
  assert.equal(widgetMarkerAfterRoute, widgetMarker, "TikTok adapter should survive supported route changes without remounting the widget.");

  for (let index = 1; index <= 6; index++) {
    await page.evaluate((nextIndex) => {
      const container = document.querySelector(".tiktok-web-player");
      const video = document.createElement("video");
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.poster = `poster-${nextIndex}`;
      video.style.width = "400px";
      video.style.height = "700px";
      video.style.display = "block";
      video.style.margin = "0 auto";
      container.replaceChildren(video);
      document.body.appendChild(document.createElement("div"));
    }, index);
    await page.waitForTimeout(350);
  }

  const score = await getWidgetScore(page);
  assert.ok(score !== null && score > 0, "TikTok score should rise after multiple successful video changes.");
}

async function driveInstagramScenario(page) {
  await page.goto("https://www.instagram.com/reel/start", { waitUntil: "domcontentloaded" });
  await waitForWidget(page);

  const widgetMarker = await getWidgetMarker(page);

  for (let index = 1; index <= 10; index++) {
    await page.evaluate((nextIndex) => {
      history.pushState({}, "", `/reel/${nextIndex}`);
      document.body.appendChild(document.createElement("div"));
    }, index);
    await page.waitForTimeout(280);
  }

  const widgetMarkerAfter = await getWidgetMarker(page);
  const score = await getWidgetScore(page);
  assert.equal(widgetMarkerAfter, widgetMarker, "Instagram adapter should keep the widget mounted across supported route changes.");
  assert.ok(score !== null && score > 0, "Instagram score should rise after multiple reel changes.");
}

async function main() {
  fs.rmSync(userDataDir, { recursive: true, force: true });

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    executablePath: getBrowserExecutable(),
    viewport: { width: 1280, height: 900 },
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  await context.route("https://www.youtube.com/shorts/*", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/html", body: getShortsHtml() });
  });
  await context.route("https://www.tiktok.com/*", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/html", body: getTikTokHtml() });
  });
  await context.route("https://www.instagram.com/*", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/html", body: getInstagramHtml() });
  });

  try {
    await verifyShortsVelocity(context);

    const page = await context.newPage();
    await driveShortsScenario(page);
    await page.close();

    const tikTokPage = await context.newPage();
    await driveTikTokScenario(tikTokPage);
    await tikTokPage.close();

    const instagramPage = await context.newPage();
    await driveInstagramScenario(instagramPage);
    await instagramPage.close();
    console.log("Runtime verification passed.");
  } finally {
    await context.close();
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

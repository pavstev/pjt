import { workspaceRoot } from "@nx/devkit";
import { nxE2EPreset } from "@nx/playwright/preset";
import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

const detectPackageManager = (): "pnpm" | "yarn" | "npm" => {
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm";
};

const pm = detectPackageManager();
const prod = Boolean(process.env.PROD || process.env.PRODUCTION);

const devCommand = {
  npm: "npm run dev",
  pnpm: "pnpm dev",
  yarn: "yarn dev",
}[pm];

const buildPreviewCommand = {
  npm: "npm run build && npm run preview",
  pnpm: "pnpm build && pnpm preview",
  yarn: "yarn build && yarn preview",
}[pm];

const screenshotExpectConfig = {
  maxDiffPixelRatio: 0.01,
};

const baseURL = process.env["BASE_URL"] ?? "http://localhost:4321";

export default defineConfig({
  ...nxE2EPreset(import.meta.filename, { testDir: "./e2e" }),

  testDir: "./e2e",
  testMatch: [
    "e2e/**/*.@(spec|test).@(ts|js|mjs|cjs)",
    ".playwright/visual/generated.visual.spec.ts",
  ],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [
      "html",
      { outputFolder: ".tmp/reports/playwright" },
    ],
  ],
  expect: {
    timeout: 10_000,
    toHaveScreenshot: screenshotExpectConfig,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `${prod ? buildPreviewCommand : devCommand} -- --port 4321`,
    url: baseURL,
    port: 4321,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    stdout: "pipe",
    stderr: "pipe",
  },
  projects: [
    {
      name: "chromium",
      testMatch: ["e2e/**/*.@(spec|test).@(ts|js|mjs|cjs)"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testMatch: ["e2e/**/*.@(spec|test).@(ts|js|mjs|cjs)"],
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testMatch: ["e2e/**/*.@(spec|test).@(ts|js|mjs|cjs)"],
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "visual-desktop",
      testMatch: [".playwright/visual/generated.visual.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        screenshot: "only-on-failure",
        video: "off",
      },
    },
    {
      name: "visual-tablet",
      testMatch: [".playwright/visual/generated.visual.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
        userAgent: devices["Desktop Chrome"].userAgent.replace(
          "Chrome",
          "Chrome Tablet",
        ),
        hasTouch: true,
        isMobile: false,
        screenshot: "only-on-failure",
        video: "off",
      },
    },
    {
      name: "visual-mobile",
      testMatch: [".playwright/visual/generated.visual.spec.ts"],
      use: {
        ...devices["Pixel 7"],
        screenshot: "only-on-failure",
        video: "off",
      },
    },
  ],
});

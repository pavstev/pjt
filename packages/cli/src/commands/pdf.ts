import type { Browser, Page } from "playwright";

import { defineCommand } from "citty";
import path from "node:path";
import { chromium } from "playwright";
import { z } from "zod";

const ScriptOptionsSchema = z.object({
  inputPath: z.string().min(1),
  outputPath: z.string().min(1),
});

type ScriptOptions = z.infer<typeof ScriptOptionsSchema>;

const isErrorWithMessage = (error: unknown): error is { message: string } =>
  typeof error === "object" &&
  error !== null &&
  "message" in error &&
  typeof (error as { message: unknown }).message === "string";

const createPdfFromHtml = async (
  page: Page,
  options: ScriptOptions,
): Promise<void> => {
  await page.goto(`file://${options.inputPath}`);
  await page.waitForLoadState("networkidle");
  await page.pdf({
    displayHeaderFooter: false,
    format: "A4",
    margin: { bottom: 0, left: 0, right: 0, top: 0 },
    path: options.outputPath,
    printBackground: true,
    scale: 1,
  });
};

const generatePdf = async (options: ScriptOptions): Promise<void> => {
  let browser: Browser | undefined = undefined;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    await createPdfFromHtml(page, options);
    console.log(`PDF exported successfully to ${options.outputPath}`);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      console.error(`Error exporting PDF: ${error.message}`);
    } else {
      console.error("An unknown error occurred while exporting the PDF.");
    }

    throw error;
  } finally {
    await browser?.close();
  }
};

export const command = defineCommand({
  args: {
    inputPath: {
      description: "Path to input HTML file",
      type: "string",
    },
    outputPath: {
      description: "Path to output PDF file",
      type: "string",
    },
  },
  meta: {
    description: "Generate PDF from HTML file",
    name: "pdf",
  },
  run: async ({ args }) => {
    const repoRoot = process.cwd();
    const options = ScriptOptionsSchema.parse({
      inputPath:
        args.inputPath || path.resolve(repoRoot, "dist/exported-cv.html"),
      outputPath:
        args.outputPath || path.resolve(repoRoot, "dist/exported-cv.pdf"),
    });

    await generatePdf(options);
  },
});

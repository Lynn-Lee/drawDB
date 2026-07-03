import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

async function readSource(relativePath) {
  return fs.readFile(path.join(repoRoot, relativePath), "utf8");
}

function extractTranslationKeys(source) {
  return Array.from(source.matchAll(/\bt\(\s*["']([^"']+)["']/g)).map(
    (match) => match[1],
  );
}

function expectLocaleKeys(localeSource, keys) {
  for (const key of keys) {
    expect(localeSource).toContain(`${key}:`);
  }
}

describe("page i18n boundary", () => {
  test("localizes standalone public pages through react-i18next", async () => {
    const pagePaths = [
      "src/pages/LandingPage.jsx",
      "src/pages/NotFound.jsx",
      "src/pages/BugReport.jsx",
      "src/pages/Templates.jsx",
    ];

    for (const pagePath of pagePaths) {
      const source = await readSource(pagePath);

      expect(source).toContain('from "react-i18next"');
      expect(source).toContain("useTranslation");
    }
  });

  test("defines every CloudDiagrams translation key in English and Chinese", async () => {
    const cloudSource = await readSource("src/pages/CloudDiagrams.jsx");
    const enSource = await readSource("src/i18n/locales/en.js");
    const zhSource = await readSource("src/i18n/locales/zh.js");
    const cloudKeys = extractTranslationKeys(cloudSource).filter((key) =>
      key.startsWith("cloud_diagrams_"),
    );

    expect(cloudKeys.length).toBeGreaterThanOrEqual(17);
    expectLocaleKeys(enSource, cloudKeys);
    expectLocaleKeys(zhSource, cloudKeys);
  });
});

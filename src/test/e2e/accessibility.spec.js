import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const seriousOrCritical = ["serious", "critical"];

async function expectNoSeriousAccessibilityViolations(page) {
  await page.waitForTimeout(1_000);

  const results = await new AxeBuilder({ page })
    .exclude(".semi-tabs-bar")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blockingViolations = results.violations.filter((violation) =>
    seriousOrCritical.includes(violation.impact),
  );

  expect(
    blockingViolations,
    blockingViolations
      .map(
        (violation) =>
          `${violation.id}: ${violation.help} (${violation.nodes.length} nodes) ${violation.nodes
            .slice(0, 3)
            .map((node) => node.target.join(" "))
            .join("; ")}`,
      )
      .join("\n"),
  ).toHaveLength(0);
}

test.describe("accessibility smoke", () => {
  async function createBlankDiagram(page) {
    await page.goto("/editor");
    await page.getByRole("button", { name: "创建空白图表" }).click();
    await expect(page.getByText("文件").first()).toBeVisible();
  }

  test("landing page has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "绘制、复制、粘贴" }),
    ).toBeVisible();

    await expectNoSeriousAccessibilityViolations(page);
  });

  test("templates page has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/templates");
    await expect(page.getByText("数据库 schema 模板")).toBeVisible();

    await expectNoSeriousAccessibilityViolations(page);
  });

  test("editor workspace has no serious or critical axe violations", async ({
    page,
  }) => {
    await createBlankDiagram(page);

    await expectNoSeriousAccessibilityViolations(page);
  });

  test("import dialog has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/editor");
    await page.getByRole("button", { name: "导入 SQL、DBML 或 JSON" }).click();
    await expect(
      page.getByRole("dialog", { name: "导入图表" }),
    ).toBeVisible();

    await expectNoSeriousAccessibilityViolations(page);
  });

  test("share dialog has no serious or critical axe violations", async ({
    page,
  }) => {
    await createBlankDiagram(page);
    await page.getByRole("button", { name: "分享" }).click();
    await expect(page.getByRole("dialog", { name: "分享" })).toBeVisible();

    await expectNoSeriousAccessibilityViolations(page);
  });
});

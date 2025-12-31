import { expect, test } from '@playwright/test';
test.describe('Matchups page smoke', () => {
  test('renders matchups page shell', async ({ page }) => {
    await page.goto('/matchups');

    const heading = page.getByRole('heading', { name: /matchups/i });
    await expect(heading).toBeVisible();

    const weekSelect = page.getByRole('combobox', { name: /week/i });
    await expect(weekSelect).toBeVisible();
    // Week selector may be disabled if upstream APIs fail; for smoke we only
    // require that the control is rendered.
  });
});

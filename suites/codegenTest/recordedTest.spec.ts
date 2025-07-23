import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storage-state/storageState.json'
});

test('test', async ({ page }) => {
  await page.goto('https://org6d780a22.crm.dynamics.com/main.aspx?forceUCI=1&pagetype=apps');
  await page.locator('iframe[title="AppLandingPage"]').contentFrame().getByRole('link', { name: 'Customer Service Hub A' }).click();
  await page.getByText('Cases', { exact: true }).click();
  await page.getByRole('link', { name: 'AutoCase_GEDFYH' }).click();
  await expect(page.getByRole('textbox', { name: 'Case Title' })).toHaveValue('AutoCase_GEDFYH');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('updated case');
  await page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
  await expect(page.getByRole('textbox', { name: 'Description' })).toHaveValue('updated case');
});
import { Page } from "@playwright/test";

export function attachGlobalPopupHandler(page: Page) {
  let dismissedPopupId = ''; // To avoid duplicate dismissals

  const closePopupIfPresent = async () => {
    try {
      const popupCloseBtn = page.locator('button[data-id="dialogCloseIconButton"]');
      const popupContainer = page.locator('[id^="modalDialogRoot_"]');
      const dialogTitle = page.locator('[id^="dialogTitleView_"]');

      const isVisible = await popupCloseBtn.isVisible({ timeout: 500 }).catch(() => false);
      if (!isVisible) {
        dismissedPopupId = ''; // Reset if not visible anymore
        return;
      }

      // Skip if business process error is present
      const titleText = await dialogTitle.innerText().catch(() => '');
      if (titleText.includes('Business Process Error') || titleText.includes('Subject Configuration Missing')) 
        return;

      // Check for known/valid dialog: skip if data-lp-id present
      const dialogIdAttr = await popupCloseBtn.getAttribute('data-lp-id').catch(() => null);
      if (dialogIdAttr !== null) return;

      const containerId = await popupContainer.getAttribute('id').catch(() => null);
      if (!containerId || containerId === dismissedPopupId) return;

      // Click and wait
      await popupCloseBtn.click({ force: true }).catch(() => { });
      await popupContainer.waitFor({ state: 'detached', timeout: 2000 }).catch(() => { });

      dismissedPopupId = containerId;
      console.log('✅ Popup auto-dismissed');
    } catch (error) {
      console.warn('❌ Failed to close popup:', error);
      // Silent fail
    }
  };

  page.on('domcontentloaded', closePopupIfPresent);
  page.on('load', closePopupIfPresent);

  const interval = setInterval(closePopupIfPresent, 2000);
  page.on('close', () => clearInterval(interval));
}
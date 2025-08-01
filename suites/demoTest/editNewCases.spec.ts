import { test, expect } from '../../fixtures/testSetup';
import { Helper } from '../../utils/helper';
import { navigateBasedOnEnv } from '../../globals/envNavigator';
import logger from '../../utils/logger';
import caseData from '../../test-data/caseData.json';
import subjectData from '../../test-data/subjectData.json';

test.describe.serial('[@Demo] Edit and Update details of the Case', () => {
  test('should be able to update the Case and verify the details', async ({ page, pageObjectManager }) => {
    const casesPage = pageObjectManager.getCasesPage();
    const helper = new Helper(page);

    // Step 1: Ensure we're on the correct page - explicit navigation
    try {
      await navigateBasedOnEnv(page, helper, pageObjectManager);
      await casesPage.clickCasesLink();
    } catch (error) {
      logger.error(`Navigation failed: ${(error as Error).message}`);
      // Retry navigation
      await page.reload();
      await helper.waitForAsyncTimeout();
      await navigateBasedOnEnv(page, helper, pageObjectManager);
      await casesPage.clickCasesLink();
    }
    
    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    // Step 2: Retrieve the case title from saved data
    const caseTitle = await casesPage.readSavedCaseTitle(subjectData.query.query);

    // Step 3: Search and open the case
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.verifyAndReadCaseDetails(caseTitle);

    // Step 4: Update subject and description
    const newSubject = subjectData.defaultSubject;
    await casesPage.selectSubject(newSubject);
    await casesPage.enterCaseDescription();

    // Step 5: Save changes
    await casesPage.clickSaveButton();

    // Step 6: Validate updates
    const actualSubject = await casesPage.getSubjectValue();
    const actualDescription = await casesPage.getDescriptionValue();
    expect(actualSubject).toBe(newSubject);
    logger.info(`Validating updated subject: expected "${newSubject}", got "${actualSubject}"`);
    expect(actualDescription).toBe(caseData.description);
    logger.info(`Validating updated description: expected "${caseData.description}", got "${actualDescription}"`);
  });
});
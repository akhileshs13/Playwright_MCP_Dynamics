import { test } from '../../fixtures/testSetup';
import { Helper } from '../../utils/helper';
import { navigateBasedOnEnv } from '../../globals/envNavigator';
import logger from '../../utils/logger';
import caseData from '../../test-data/caseData.json';
import subjectData from '../../test-data/subjectData.json';

test.describe.serial('[@Demo] Select and Resolve the Case', () => {
  test('should be able to resolve the Case with configured Subject', async ({ page, pageObjectManager }) => {
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

    // Step 4: Resolve the case
    await casesPage.clickOnResolutionCaseButton();
    await casesPage.enterResolutionForCase(caseData.resolutionText);
    await casesPage.clickOnResolveButtonInPopUp();
    const subjectType = 'Query';
    await casesPage.validateResolutionSuccessMsg(caseTitle, subjectType);

    // Step 5: Verify the case is no longer present in the list
    await casesPage.clickCasesLink();
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.isCasePresentInList(caseTitle);
  });
});
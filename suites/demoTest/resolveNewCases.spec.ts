import { test } from '../../fixtures/testSetup';
import caseData from '../../test-data/caseData.json';
import subjectData from '../../test-data/subjectData.json';

test.describe.serial('[@Demo] Select and Resolve the Case', () => {
  test('should be able to resolve the Case with configured Subject', async ({ pageObjectManager }) => {
    const casesPage = pageObjectManager.getCasesPage();

    // Step 1: Retrieve the case title from saved data
    const caseTitle = await casesPage.readSavedCaseTitle(subjectData.query.query);

    // Step 2: Search and open the case
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.verifyAndReadCaseDetails(caseTitle);

    // Step 3: Resolve the case
    await casesPage.clickOnResolutionCaseButton();
    await casesPage.enterResolutionForCase(caseData.resolutionText);
    await casesPage.clickOnResolveButtonInPopUp();
    const subjectType = 'Query';
    await casesPage.validateResolutionSuccessMsg(caseTitle, subjectType);

    // Step 4: Verify the case is no longer present in the list
    await casesPage.clickCasesLink();
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.isCasePresentInList(caseTitle);
  });
});
import { test, expect } from '../../fixtures/testSetup';
import { Helper } from '../../utils/helper';
import { navigateBasedOnEnv } from '../../globals/envNavigator';
import logger from '../../utils/logger';
import caseData from '../../test-data/caseData.json';
import subjectData from '../../test-data/subjectData.json';

test.describe.serial('[@Demo] Edit and Update details of the Case', () => {
  test('should be able to update the Case and verify the details', async ({ pageObjectManager }) => {
    const casesPage = pageObjectManager.getCasesPage();

    // Step 1: Retrieve the case title from saved data
    const caseTitle = await casesPage.readSavedCaseTitle(subjectData.query.query);

    // Step 2: Search and open the case
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.verifyAndReadCaseDetails(caseTitle);

    // Step 3: Update subject and description
    const newSubject = subjectData.defaultSubject;
    await casesPage.selectSubject(newSubject);
    await casesPage.enterCaseDescription();

    // Step 4: Save changes
    await casesPage.clickSaveButton();

    // Step 5: Validate updates
    const actualSubject = await casesPage.getSubjectValue();
    const actualDescription = await casesPage.getDescriptionValue();
    expect(actualSubject).toBe(newSubject);
    logger.info(`Validating updated subject: expected "${newSubject}", got "${actualSubject}"`);
    expect(actualDescription).toBe(caseData.description);
    logger.info(`Validating updated description: expected "${caseData.description}", got "${actualDescription}"`);
  });
});
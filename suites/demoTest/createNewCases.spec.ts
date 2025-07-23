import { test } from '../../fixtures/testSetup';
import caseData from '../../test-data/caseData.json';
import subjectData from '../../test-data/subjectData.json';

test.describe.serial('[@Demo] Create and Validate the new Case', () => {
  test('should be able to create a Case with configured Subject', async ({ pageObjectManager }) => {
    const casesPage = pageObjectManager.getCasesPage();

    // Step 1: Start new case creation
    await casesPage.clickNewCaseButton();

    // Step 2: Select subject (parameterized for scalability)
    const subject = subjectData.query.information;
    await casesPage.selectSubject(subject);

    // Step 3: Select customer via lookup
    const customerField = caseData.customer;
    await casesPage.clickLookupSearchIcon(customerField);
    await casesPage.clickOnAdvancedLookupRecord();

    // Step 4: Select a random origin 
    await casesPage.selectRandomOriginOption();

    // Step 5: Enter a unique case title
    const subjectType = 'Query';
    const { caseTitle } = await casesPage.enterUniqueCaseTitle(subjectType);

    // Step 6: Save and persist case info
    await casesPage.clickSaveAndCloseAndWrite(caseTitle, subjectType);

    // Step 7: Validate case creation (e.g., search and read back the case)
    await casesPage.clickCasesLink();
    await casesPage.searchCaseInFilter(caseTitle);
    await casesPage.isCasePresentInList(caseTitle);
  });
});
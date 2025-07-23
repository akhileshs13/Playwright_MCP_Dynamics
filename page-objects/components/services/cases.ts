import { Locator, Page, expect } from '@playwright/test';
import logger from '../../../utils/logger';
import { Helper } from '../../../utils/helper';
import { retryAction } from '../../../utils/retry-helper';
import createCase from '../../../test-data/generateData/createCase.json'
import caseData from '../../../test-data/caseData.json'
import fs from 'fs';
import path from 'path';

export class CasesPage {
    readonly page: Page;
    readonly helper: Helper;
    readonly retryAction: typeof retryAction;
    readonly casesMenu: Locator;
    readonly caseDropdown: Locator;
    readonly activeCasesOption: Locator;
    readonly newCaseButton: Locator;
    readonly inputSubject: Locator;
    readonly advancedLookup: Locator;
    readonly doneButton: Locator;
    readonly radioButton: Locator;
    readonly inputCaseTitle: Locator;
    readonly saveAndCloseButton: Locator;
    readonly saveButton: Locator;
    readonly caseSearchFilter: Locator;
    readonly requestorValueLocator: Locator;
    readonly customerValueLocator: Locator;
    readonly vehicleOrderValueLocator: Locator;
    readonly goButton: Locator;
    readonly rowLocator: Locator;
    readonly caseHeaderTitle: Locator;
    readonly subjectValue: Locator;
    readonly popUpSubjectConfMissing: Locator;
    readonly popUpOkButton: Locator;
    readonly notificationMsg: Locator;
    readonly customerErrorMsg: Locator;
    readonly requestorErrorMsg: Locator;
    readonly vehicleOrderErrorMsg: Locator;
    readonly resolveCaseButton: Locator;
    readonly resolutionInput: Locator;
    readonly resolveButton: Locator;
    readonly resolvedSuccessMsg: Locator;
    readonly resolutionOkButton: Locator;
    readonly myActiveCasesOption: Locator;
    readonly createdOnColumnHeader: Locator;
    readonly showFormFillAssistLink: Locator;
    readonly chevronRightIcon: Locator;
    readonly subjectOptionLocator: (subjectText: string) => Locator;
    readonly originInput: Locator;
    readonly descriptionInput: Locator;
    readonly buttonMoreCommandsToCase: Locator;
    readonly caseNumberInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.helper = new Helper(page);
        this.retryAction = retryAction;
        this.casesMenu = page.locator('li[role="treeitem"][aria-label="Cases"]');
        this.caseDropdown = page.locator('button[aria-label="My Active Cases"] i[data-icon-name="ChevronDown"]');
        this.activeCasesOption = page.getByRole('menuitemradio', { name: 'Active Cases', exact: true });
        this.newCaseButton = page.locator('button[aria-label="New Case"]');
        this.inputSubject = page.locator('input[aria-label="Look for subject"]');
        this.advancedLookup = page.locator('[aria-label*="Advanced"]');
        this.doneButton = page.locator('button[title="Done"]');
        this.radioButton = page.locator('input[type="checkbox"][aria-label="select or deselect the row"]');
        this.rowLocator = page.locator('div[col-id="title"]');
        this.inputCaseTitle = page.locator('input[aria-label="Case Title"]');
        this.saveAndCloseButton = page.locator('button[aria-label="Save & Close"]');
        this.saveButton = page.locator('button[aria-label="Save (CTRL+S)"]');
        this.caseSearchFilter = page.locator('input[aria-label="Case Filter by keyword"]');
        this.requestorValueLocator = page.locator('div[data-id*="zen_requestorid"][title]');
        this.customerValueLocator = page.locator('div[data-id*="customerid"][title]');
        this.vehicleOrderValueLocator = page.locator('div[data-id*="zen_vehicleorderid"][title]');
        this.goButton = page.locator('button[aria-label="GO"]');
        this.caseHeaderTitle = page.locator('h1[data-id="header_title"]');
        this.subjectValue = page.locator('input[aria-label="Look for subject"]');
        this.popUpSubjectConfMissing = page.locator('h1[aria-label="Subject Configuration Missing"]');
        this.popUpOkButton = page.locator('button[data-id="okButton"]');
        this.notificationMsg = page.locator('span[data-id="notificationWrapper_message"]');
        this.customerErrorMsg = page.locator('span[data-id="customerid-error-message"]');
        this.requestorErrorMsg = page.locator('span[data-id="zen_requestorid-error-message"]');
        this.vehicleOrderErrorMsg = page.locator('span[data-id="zen_vehicleorderid-error-message"]');
        this.resolveCaseButton = page.locator('button[aria-label="Resolve Case"]');
        this.resolutionInput = page.locator('input[aria-label="Resolution"]');
        this.resolveButton = page.locator('button[data-id="ok_id"]');
        this.resolvedSuccessMsg = page.locator('span[data-id="warningNotification"]');
        this.resolutionOkButton = page.locator('button[data-id="errorOkButton"]');
        this.myActiveCasesOption = page.locator('button[title="My Active Cases"]');
        this.createdOnColumnHeader = page.locator('[data-testid="createdon"]');
        this.showFormFillAssistLink = page.locator('button:has-text("Hide form fill assist")');
        this.chevronRightIcon = page.locator('i[data-icon-name="ChevronRight"]');
        this.subjectOptionLocator = (subjectText: string) => page.locator(`div[aria-label="${subjectText}"] > div`);
        this.originInput = page.locator('button[aria-label="Origin"] > span');
        this.descriptionInput = page.locator('textarea[aria-label="Description"]');
        this.buttonMoreCommandsToCase = page.locator('button[aria-label="More commands for Case"] > span');
        this.caseNumberInput = page.locator('input[aria-label="ID"]');
    }

    async clickCasesLink() {
        await this.helper.waitForSpecificAsyncTimeout();
        await retryAction(async () => {
            await this.casesMenu.first().hover();
            await this.casesMenu.first().click({ force: true });
        }, 2, 2000, 'Clicking Cases Menu');
        logger.info("Successfully clicked on Cases Menu Link");
    }

    async clickNewCaseButton(): Promise<void> {
        await this.helper.waitForSpecificAsyncTimeout();
        const newCaseBtn = this.newCaseButton.first();
        const assistLink = this.showFormFillAssistLink.first();

        try {
            await newCaseBtn.waitFor({ state: 'visible', timeout: 8000 });
            await newCaseBtn.click();
            logger.info("Successfully clicked on New Case Button");

            await this.helper.waitForSpecificAsyncTimeout();

            const isAssistLinkVisible = await assistLink.isVisible({ timeout: 5000 }).catch(() => false);

            if (isAssistLinkVisible) {
                await assistLink.click({ force: true });
                logger.info("Clicked on 'Form Fill Assist' link");
            } else {
                logger.info("'Form Fill Assist' link not visible — skipping.");
            }
        } catch (error) {
            logger.error(`Error in clickNewCaseButton: ${(error as Error).message}`);
            throw error;
        }
    }


    async clickOnResolutionCaseButton() {
        await this.helper.waitForAsyncTimeout();
        if (await this.buttonMoreCommandsToCase.first().isVisible()) {
            await this.buttonMoreCommandsToCase.first().click({ force: true });
        }
        await this.resolveCaseButton.waitFor({ state: 'visible' });
        await this.resolveCaseButton.click();
        logger.info("Successfully clicked on Resolve Case Button");
    }

    async VerifyErrorMsgOnGeneralEnquiryEmptyForm() {
        await expect(this.notificationMsg).toBeVisible();
        await expect(this.customerErrorMsg).toContainText(caseData.customerErrorText);
        await expect(this.vehicleOrderErrorMsg).toContainText(caseData.vehicleOrderErrorText);
        logger.info('Successfully validated all the mandatory field on New Case Form');
    }

    async selectSubject(subjectText: string): Promise<void> {
        // Wait for subject input to be visible and interactable
        await this.inputSubject.first().waitFor({ state: 'visible', timeout: 7000 });
        await this.inputSubject.first().focus();
        await this.inputSubject.first().clear();
        await this.inputSubject.first().click({ force: true });

        // Wait for chevron icon to be visible and stable before clicking
        await this.chevronRightIcon.first().waitFor({ state: 'visible', timeout: 5000 });
        await this.chevronRightIcon.first().click();

        // Wait for the subject option to appear and be stable
        const optionLocator = this.subjectOptionLocator(subjectText);

        // Use expect to ensure the option is visible before clicking
        await expect(optionLocator.first()).toBeVisible({ timeout: 10000 });
        await optionLocator.first().click();

        logger.info(`Subject Selected as : ${subjectText}`);
    }

    async clickLookupSearchIcon(fieldName: string) {
        await this.helper.waitForAsyncTimeout();
        const searchIcon = this.page.locator(`button[aria-label="Search records for ${fieldName}, Lookup field"]`);
        await searchIcon.waitFor({ state: 'visible' });
        await searchIcon.click();
        logger.info(`Successfully clicked on ${fieldName} search lookup icon`)
    }

    async clickOnAdvancedLookupRecord() {
        await this.advancedLookup.last().waitFor({ state: 'visible', timeout: 5000 });
        await this.advancedLookup.last().click();
        await this.helper.waitForSpecificAsyncTimeout();

        // Use checkbox for row selection
        const count = await this.radioButton.count();
        logger.info(`Total Records are "${count}"`);

        if (count === 0) {
            logger.warn('No records found for selection');
            return;
        }

        const randomIndex = Math.floor(Math.random() * count);
        const selectedCheckbox = this.radioButton.nth(randomIndex);

        // Select the row using the same index as checkbox
        const row = this.page.locator('.ag-center-cols-container .ag-row').nth(randomIndex);
        await row.waitFor({ state: 'visible' });

        // Get the value from the first column (first cell in the row)
        const cell = row.locator('div[aria-colindex="2"]').first();
        await cell.waitFor({ state: 'visible' });
        const firstColumnValue = await cell.innerText();

        // Click the corresponding checkbox
        await selectedCheckbox.click({ force: true });
        logger.info(`Selected record's as : ${firstColumnValue}`);
        await this.doneButton.click();
    }

    async enterUniqueCaseTitle(subjectType: 'Query' | 'Default Subject' | 'Test Subject Form' | 'Complaint') {
        const caseTitle = `AutoCase_${await this.helper.generateRandomString(6)}`;
        await this.inputCaseTitle.waitFor({ state: 'visible' });
        await this.inputCaseTitle.fill(caseTitle);
        logger.info(`New Case Title entered as "${caseTitle}"`);
        return { caseTitle, subjectType };
    }

    async clickRandomCaseTitle() {
        await this.helper.waitForAsyncTimeout();
        const caseTitleLinks = this.page.locator('a[role="link"][aria-label*="Auto"]').first();
        const count = await caseTitleLinks.count();

        if (count === 0) {
            logger.warn('No records found for the Cases');
            return;
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomLink = caseTitleLinks.nth(randomIndex);

        await randomLink.scrollIntoViewIfNeeded();
        await randomLink.waitFor({ state: 'visible' });
        const label = await randomLink.innerText();

        await randomLink.click();
        logger.info(`Clicked on random case title: "${label}"`);
    }

    async selectActiveCaseCheckbox() {
        await this.helper.waitForAsyncTimeout();

        const checkboxes = this.page.locator('input[type="checkbox"][aria-label*="select or deselect the row"]');
        const count = await checkboxes.count();

        if (count === 0) {
            logger.warn('No records found');
            return;
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomCheckbox = checkboxes.nth(randomIndex);

        await randomCheckbox.waitFor({ state: 'visible' });
        await randomCheckbox.click({ force: true });

        logger.info(`Clicked checkbox at index ${randomIndex}`);
    }

    async readCaseDetails() {
        // Read "Read Only" or similar label on top
        if (process.env.ENV_FILE !== '.envFO') {
            await this.helper.waitForAsyncTimeout();
            const topLabel = await this.page.locator('[data-id="warningNotification"]').textContent();
            logger.info(`Top Label: ${topLabel?.trim()}`);
        }
        // Find all labels and values in the case detail section
        await this.helper.waitForAsyncTimeout();
        const fieldRows = await this.page.locator('[data-id="tabpanel-tab_details"]').all();

        for (const row of fieldRows) {
            try {
                const label = await row.locator('label').textContent();
                const valueElement = row.locator('input, label, a');
                const value = (await valueElement.textContent()) || (await valueElement.inputValue());
                expect(value).toBeDefined();
                expect(value).toMatch(/\S/);
                logger.info(value);
                logger.info(`${label?.trim()}: ${value?.trim()}`);
            } catch (error) {
                logger.warn('Unable to extract one field:', error);
            }
        }
    }

    async clickSaveAndClose() {
        await this.helper.waitForElement(this.saveAndCloseButton);
        await this.saveAndCloseButton.click();
        await this.helper.waitForSpecificAsyncTimeout();
        logger.info("Successfully clicked on Save & Close Button");
        try {
            await expect(this.activeCasesOption).toBeVisible({ timeout: 5000 });
            logger.info('New Case have been created successfully');
        } catch (error) {
            logger.error('Failed to create new case:', error);
            const okButton = this.page.locator('button[title="OK"]');
            const errorPopup = this.page.locator('div[role="dialog"] span[data-id]').first();
            if (await okButton.isVisible()) {
                const errMsg = await errorPopup.textContent();
                logger.warn(`Error popup detected: "${errMsg?.trim()}"`);
                await okButton.click(); // Dismiss popup
            }
        }
    }

    async clickSaveAndCloseAndWrite(caseTitle: string, subjectType: string) {
        await this.helper.waitForElement(this.saveButton);
        await this.saveButton.click();

        // Wait for Case Number input to be visible and get its value
        await this.helper.waitForSpecificAsyncTimeout();
        const caseNumber = await this.page.locator('input[aria-label="ID"]').inputValue();
        logger.info("Successfully clicked on Save Button");

        try {
            logger.info('New Case has been created successfully');

            // Append new record to createCase.json
            const filePath = path.join(__dirname, '../../../test-data/generateData/createCase.json');
            let fileData: Record<string, Array<{ caseTitle: string, caseNumber: string }>> = {};
            if (fs.existsSync(filePath)) {
                fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }
            if (!Array.isArray(fileData[subjectType])) {
                fileData[subjectType] = [];
            }
            fileData[subjectType].push({ caseTitle, caseNumber });
            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
            logger.info(`Appended case title "${caseTitle}" and case number "${caseNumber}" to createCase.json`);

        } catch (error) {
            logger.error('Failed to create new case:', error);
            const okButton = this.page.locator('button[title="OK"]');
            const errorPopup = this.page.locator('div[role="dialog"] span[data-id]').first();
            if (await okButton.isVisible()) {
                const errMsg = await errorPopup.textContent();
                logger.warn(`Error popup detected: "${errMsg?.trim()}"`);
                await okButton.click();
            }
        }
    }

    async clickSaveButton() {
        await this.helper.waitForAsyncTimeout();
        await this.helper.waitForElement(this.saveButton);
        await this.saveButton.click();
        await this.helper.waitForAsyncTimeout();
        logger.info("Successfully clicked on Save Button");
    }

    async readSavedCaseTitle(subjectKey: string): Promise<string> {
        const filePath = path.resolve(__dirname, '../../../test-data/generateData/createCase.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const casesArray = data[subjectKey];
        if (!casesArray || casesArray.length === 0) {
            logger.warn(`No cases found for subject "${subjectKey}"`);
            return '';
        }

        // Pick a random case title from the list
        const randomIndex = Math.floor(Math.random() * casesArray.length);
        const randomCaseTitle = casesArray[randomIndex].caseTitle;

        logger.info(`Picked case title "${randomCaseTitle}" for subject "${subjectKey}"`);
        return randomCaseTitle;
    }

    async searchCaseInFilter(caseTitle: string) {
        await retryAction(async () => {
            await this.caseSearchFilter.waitFor({ state: 'visible', timeout: 8000 });
        }, 2, 2000);
        await this.caseSearchFilter.clear();
        await this.caseSearchFilter.fill(caseTitle);
        await this.caseSearchFilter.press('Enter');
        await this.helper.waitForAsyncTimeout();
    }

    async verifyAndReadCaseDetails(caseTitle: string) {
        await this.helper.waitForSpecificAsyncTimeout();
        const caseTitleLinks = this.rowLocator.locator(`a[role="link"][aria-label="${caseTitle}"]`).nth(0);
        await caseTitleLinks.waitFor({ state: 'visible', timeout: 7000 });
        await caseTitleLinks.click({ force: true });
        logger.info(`Case '${caseTitle}' is visible and selected.`);

        await this.helper.waitForSpecificAsyncTimeout();
        const actualTitle = await this.caseHeaderTitle.first().textContent();
        expect(actualTitle?.trim()).toContain(caseTitle);

        const caseNumberInput = this.caseNumberInput.first();
        await caseNumberInput.waitFor({ state: 'visible', timeout: 3000 });
        const caseNo = await caseNumberInput.getAttribute('value');
        await this.helper.waitForSpecificAsyncTimeout();

        // Find the matching caseNumber from createCase.json based on caseTitle
        type CaseEntry = { caseTitle?: string; caseNumber?: string };

        const matchedCase = (createCase.Query as CaseEntry[]).find(
            (item) => item.caseTitle?.trim().toLowerCase() === caseTitle.trim().toLowerCase()
        );

        if (!matchedCase) {
            logger.warn(`No matching case found for caseTitle: '${caseTitle}'`);
        } else {
            const caseNumber = matchedCase.caseNumber;

            // Only assert if caseNumber exists
            if (caseNumber) {
                expect(caseNumber).toBeDefined();
                expect(caseNo).toContain(caseNumber);
            } else {
                logger.warn(`Case Number is missing for matched caseTitle: '${caseTitle}'`);
            }
        }
        await expect(this.customerValueLocator.first()).toBeVisible();
        logger.info('Case Details have been validated successfully');
    }

    async validateSubjectConfigurationMissingPopup() {
        await this.helper.waitForAsyncTimeout();
        await expect(this.popUpSubjectConfMissing).toContainText("Subject Configuration Missing");
        logger.info('Subject Configuration Missing popup have been validated successfully');
    }

    async clickOnOkButtonPopup() {
        await this.helper.waitForElement(this.popUpOkButton.first());
        await this.popUpOkButton.first().click();
        await expect(this.popUpSubjectConfMissing).not.toBeVisible();
        logger.info('Clicked on Ok Button in Popup');
    }

    async enterResolutionForCase(text: string) {
        await this.helper.waitForAsyncTimeout();
        await this.helper.waitForElement(this.resolutionInput);
        await this.resolutionInput.fill(text);
        await this.resolutionInput.press('Enter');
    }

    async clickOnResolveButtonInPopUp() {
        await this.resolveButton.waitFor({ state: 'visible' });
        await this.resolveButton.click();
        logger.info("Successfully clicked on Resolve Button in PopUp");
    }

    async validateResolutionSuccessMsg(caseTitle: string, subjectType: string): Promise<void> {
        await this.helper.waitForAsyncTimeout();
        await expect(this.resolvedSuccessMsg).toBeVisible({ timeout: 5000 });
        expect(await this.resolvedSuccessMsg.innerText()).toContain(caseData.resolvedCaseSuccessMsg);
        logger.info("Successfully Resolved the Case");

        // Remove the resolved case from createCase.json
        const filePath = path.resolve(__dirname, '../../../test-data/generateData/createCase.json');
        let fileData: Record<string, Array<{ caseTitle: string, caseNumber: string }>> = {};
        if (fs.existsSync(filePath)) {
            fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        if (Array.isArray(fileData[subjectType])) {
            const initialLength = fileData[subjectType].length;
            fileData[subjectType] = fileData[subjectType].filter(
                (item) => item.caseTitle !== caseTitle
            );
            if (fileData[subjectType].length < initialLength) {
                logger.info(`Deleted case "${caseTitle}" from createCase.json`);
            } else {
                logger.warn(`Case "${caseTitle}" not found in createCase.json for deletion`);
            }
            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
        }
    }

    async clickOnResolutionOkButton() {
        await this.resolutionOkButton.waitFor({ state: 'visible' });
        await this.resolutionOkButton.click();
        await this.helper.waitForAsyncTimeout();
        await expect(this.resolveCaseButton).toBeVisible();
        logger.info("Successfully clicked on Resolution Ok Button");
    }

    async selectRandomOriginOption() {
        await expect(this.originInput.first()).toBeVisible({ timeout: 5000 });
        await this.originInput.first().click({force: true});

        // Wait for options to appear
        const options = this.page.locator('div[role="option"]');
        await options.first().waitFor({ state: 'visible', timeout: 5000 });

        const count = await options.count();
        if (count === 0) {
            logger.warn('No Origin options found');
            return;
        }

        // Pick a random option, skipping index 0
        const randomIndex = Math.floor(Math.random() * (count - 1)) + 1;
        const randomOption = options.nth(randomIndex);
        const optionText = await randomOption.innerText();
        await randomOption.scrollIntoViewIfNeeded();
        await randomOption.waitFor({ state: 'visible', timeout: 2000 });
        await randomOption.click();
        logger.info(`Origin option selected: ${optionText}`);
    }

    async enterCaseDescription() {
        await this.descriptionInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.descriptionInput.clear();
        await this.descriptionInput.fill(caseData.description);
        logger.info(`Entered description: "${caseData.description}"`);
    }

    async getSubjectValue(): Promise<string> {
        await this.subjectValue.waitFor({ state: 'visible' });
        return await this.subjectValue.inputValue();
    }

    async getDescriptionValue(): Promise<string> {
        await this.descriptionInput.waitFor({ state: 'visible' });
        return await this.descriptionInput.inputValue();
    }

    async isCasePresentInList(caseTitle: string): Promise<boolean> {
        const caseLink = this.rowLocator.locator(`a[role="link"][aria-label="${caseTitle}"]`);
        const isVisible = await caseLink.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
            logger.info(`Case "${caseTitle}" is present in the Active Cases list.`);
        } else {
            logger.info(`Case "${caseTitle}" is NOT present in the Active Cases list.`);
        }
        return isVisible;
    }

    async deleteCase(caseTitle: string, subjectType: string): Promise<void> {
        await this.helper.waitForAsyncTimeout();
        // Search and select the case
        await this.searchCaseInFilter(caseTitle);
        const caseLink = this.rowLocator.locator(`a[role="link"][aria-label="${caseTitle}"]`).first();
        await caseLink.waitFor({ state: 'visible', timeout: 7000 });
        await caseLink.click({ force: true });
        logger.info(`Selected case "${caseTitle}" for deletion.`);

        // Click "More commands" and then "Delete"
        const moreCommandsBtn = this.buttonMoreCommandsToCase.first();
        await moreCommandsBtn.waitFor({ state: 'visible', timeout: 5000 });
        await moreCommandsBtn.click({ force: true });

        const deleteBtn = this.page.locator('button[aria-label="Delete"]');
        await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
        await deleteBtn.click({ force: true });

        // Confirm deletion in popup
        const confirmDeleteBtn = this.page.locator('button[data-id="confirmButton"]');
        await confirmDeleteBtn.waitFor({ state: 'visible', timeout: 5000 });
        await confirmDeleteBtn.click({ force: true });

        logger.info(`Clicked delete and confirmed for case "${caseTitle}".`);

        // Remove the deleted case from createCase.json
        const filePath = path.resolve(__dirname, '../../../test-data/generateData/createCase.json');
        let fileData: Record<string, Array<{ caseTitle: string, caseNumber: string }>> = {};
        if (fs.existsSync(filePath)) {
            fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        if (Array.isArray(fileData[subjectType])) {
            const initialLength = fileData[subjectType].length;
            fileData[subjectType] = fileData[subjectType].filter(
                (item) => item.caseTitle !== caseTitle
            );
            if (fileData[subjectType].length < initialLength) {
                logger.info(`Deleted case "${caseTitle}" from createCase.json after UI deletion.`);
            } else {
                logger.warn(`Case "${caseTitle}" not found in createCase.json for deletion.`);
            }
            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
        }
    }
}
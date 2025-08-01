import { test, expect } from '@playwright/test';
import { CasePage } from '../pages/casePage';
import dotenv from 'dotenv';
import path from 'path';

// Clear any existing environment variables that might conflict
delete process.env.DY_USERNAME;
delete process.env.DY_PASSWORD; 
delete process.env.DY_URL;

// Load MCP-specific .env-mcp file with absolute path
const envPath = path.resolve(__dirname, '../.env-mcp');
console.log(`📂 Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

test.describe('Case Creation', () => {
  // Use authentication state from setup
  test.use({ storageState: 'MCP/storage-state/storageState.json' });

  test('should create a new case and validate', async ({ page }) => {
    console.log(`🔍 Environment check: DY_USERNAME=${process.env.DY_USERNAME}`);
    console.log(`🔍 Environment check: DY_URL=${process.env.DY_URL}`);
    
    const casePage = new CasePage(page);
    
    // Navigate directly to Dynamics 365 (already authenticated via storageState)
    await page.goto(process.env.DY_URL!);
    
    // Try direct URL navigation with more lenient loading
    console.log('Navigating directly to case creation form...');
    await page.waitForTimeout(2000); // Wait for login to complete
    
    const currentUrl = page.url();
    console.log(`Current URL after login: ${currentUrl}`);
    
    try {
      const baseUrl = currentUrl.split('/main.aspx')[0];
      const caseCreateUrl = `${baseUrl}/main.aspx?etn=incident&pagetype=entityrecord`;
      console.log(`Trying direct navigation to: ${caseCreateUrl}`);
      
      // Use more lenient loading strategy
      await page.goto(caseCreateUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(5000); // Give more time for Dynamics to load
      await casePage.closePopupsAndSuggestions();
      
      // Check if we have case form elements
      const caseFormVisible = await page.isVisible('[aria-label="Case Title"]').catch(() => false);
      const subjectFieldVisible = await page.isVisible('[aria-label="Look for subject"]').catch(() => false);
      
      console.log(`Direct URL result - Case Title: ${caseFormVisible}, Subject: ${subjectFieldVisible}`);
      
      if (!caseFormVisible && !subjectFieldVisible) {
        console.log('Direct URL did not load case form, falling back to UI navigation...');
        await casePage.navigateToCases();
        await casePage.clickNewCase();
      } else {
        console.log('Successfully loaded case form via direct URL!');
      }
      
    } catch (e) {
      console.log(`Direct URL navigation failed: ${e.message}`);
      console.log('Falling back to UI navigation...');
      await casePage.navigateToCases();
      await casePage.clickNewCase();
    }
    
    // Fill the complete case form (includes subject, customer selection with random radio button, origin, title, description)
    const caseTitle = await casePage.fillCaseForm();
    
    await casePage.saveCase();
    
    // Only validate through search filter as requested - test ends here
    console.log('\n📋 Performing search filter validation...');
    const searchValidation = await casePage.validateCaseCreatedWithSearch(caseTitle);
    
    if (searchValidation) {
      console.log(`✅ Case "${caseTitle}" search filter validation successful! Test completed.`);
    } else {
      console.log(`❌ Case "${caseTitle}" search filter validation failed! Test completed.`);
    }
    
    // Test case ends here - no additional validations
    expect(searchValidation).toBe(true);
  });

  test('should be able to resolve the Case with configured Subject', async ({ page }) => {
    const casePage = new CasePage(page);
    
    // Navigate directly to Dynamics 365 (already authenticated via storageState)
    await page.goto(process.env.DY_URL!);
    
    // Navigate directly to Cases list
    console.log('📋 Navigating to Cases...');
    await casePage.navigateToCases();
    
    // Wait for the cases list to load
    await page.waitForTimeout(5000);
    
    // Look for existing cases in "My Active Cases" table
    console.log('🔍 Looking for existing cases in My Active Cases table...');
    
    // First, ensure we're on the right view (My Active Cases)
    const activeView = await page.isVisible('text="My Active Cases"').catch(() => false);
    if (!activeView) {
      console.log('⚠️ Not on My Active Cases view, trying to navigate...');
      const viewSelectors = [
        'text="My Active Cases"',
        '[aria-label="My Active Cases"]',
        'button:has-text("My Active Cases")'
      ];
      
      for (const selector of viewSelectors) {
        try {
          if (await page.isVisible(selector).catch(() => false)) {
            await page.click(selector);
            await page.waitForTimeout(3000);
            break;
          }
        } catch (e) {
          console.log(`View selector ${selector} failed: ${e.message}`);
        }
      }
    }
    
    // Select a case via checkbox from My Active Cases table
    console.log('🔍 Selecting a case via checkbox from My Active Cases table...');
    const caseTitle = await casePage.selectFirstCaseViaCheckbox();
    
    if (!caseTitle) {
      throw new Error('❌ No active cases found to resolve. Please ensure there are cases in "My Active Cases" view.');
    }
    
    console.log(`📂 Selected case: ${caseTitle}`);
    
    // Open the selected case
    console.log('📂 Opening selected case...');
    const opened = await casePage.openSelectedCase(caseTitle);
    expect(opened).toBe(true);
    
    // Verify case details are loaded
    console.log('✅ Verifying case details are loaded...');
    await casePage.verifyCaseDetailsLoaded();
    
    // Resolve the case
    console.log('🔧 Resolving the case...');
    const resolutionText = "fixed the issue";
    const resolved = await casePage.resolveCase(resolutionText);
    expect(resolved).toBe(true);
    
    // Validate resolution success message
    console.log('✅ Validating resolution success...');
    const successMessageDisplayed = await casePage.validateResolutionSuccess();
    expect(successMessageDisplayed).toBe(true);
    
    console.log('✅ Case resolution test completed successfully!');
  });

  test('should be able to edit a Case with new description and origin', async ({ page }) => {
    console.log('🆔 Starting case edit test...');
    
    // Initialize page objects  
    const casePage = new CasePage(page);
    
    // Navigate to the main page (already authenticated)
    await page.goto(process.env.DY_URL!);
    
    console.log('✏️ Editing case with new description and dynamically selected origin...');
    
    // Define new description for editing
    const newDescription = "Updated case description - automated edit test";
    
    console.log(`📝 Target Description: "${newDescription}"`);
    console.log(`🔄 Origin: Will be dynamically selected (different from current)`);
    
    // Perform case edit with dynamic origin selection
    const editSuccess = await casePage.editCase(newDescription);
    expect(editSuccess).toBe(true);
    
    console.log('✅ Case edit test completed successfully!');
  });
});

import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import dotenv from 'dotenv';
import path from 'path';

// Clear any existing environment variables and load MCP-specific .env
delete process.env.DY_USERNAME;
delete process.env.DY_PASSWORD;
delete process.env.DY_URL;
// Use absolute path to ensure we get the MCP .env-mcp file
const envPath = path.resolve(__dirname, '../.env-mcp');
console.log(`📂 Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const authFile = './MCP/storage-state/storageState.json';

setup('authenticate', async ({ page }) => {
  console.log('🔐 MCP Authentication Setup Starting...');
  
  // Validate environment variables
  if (!process.env.DY_USERNAME || process.env.DY_USERNAME.includes('<<')) {
    throw new Error(`Invalid DY_USERNAME: ${process.env.DY_USERNAME}`);
  }
  if (!process.env.DY_PASSWORD || process.env.DY_PASSWORD.includes('<<')) {
    throw new Error(`Invalid DY_PASSWORD: ${process.env.DY_PASSWORD}`);
  }
  if (!process.env.DY_URL || process.env.DY_URL.includes('<<')) {
    throw new Error(`Invalid DY_URL: ${process.env.DY_URL}`);
  }
  
  console.log(`🔍 Using credentials: ${process.env.DY_USERNAME}`);
  console.log(`🔍 Target URL: ${process.env.DY_URL}`);

  const loginPage = new LoginPage(page);
  
  try {
    // Navigate to Dynamics 365
    await page.goto(process.env.DY_URL!);
    
    // Perform login
    await loginPage.login(process.env.DY_USERNAME!, process.env.DY_PASSWORD!);
    
    // Wait for successful login and Dynamics to be ready with a longer timeout
    console.log('⏳ Waiting for Dynamics main page...');
    await page.waitForURL('**/main.aspx**', { timeout: 120000 });
    
    // Verify we're logged in by checking for user indicator
    await expect(page.locator('[data-id="mectrl_main_trigger"], [aria-label*="Account manager"], .mectrl_main_trigger')).toBeVisible({ timeout: 30000 });
    
    console.log('✅ MCP Authentication completed successfully');
    
    // Save signed-in state to reuse in tests
    await page.context().storageState({ path: authFile });
    console.log(`💾 Storage state saved to: ${authFile}`);
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    console.log(`Current URL: ${page.url()}`);
    throw error;
  }
});

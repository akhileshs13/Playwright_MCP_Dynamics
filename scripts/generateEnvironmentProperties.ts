import fs from 'fs';
import path from 'path';
import os from 'os';
import { name as framework } from '../package.json';
import playwrightConfig from '../playwright.config';
// Dynamically get browser and environment (customize as needed)

export function generateEnvironmentProperties() {
  const project = playwrightConfig.projects && playwrightConfig.projects[0];
  const browser = (project && project.use && project.use.browserName) || process.env.BROWSER || 'chromium';
  const environment = process.env.ENVIRONMENT || process.env.TARGET_ENV || 'Test';
  const executedBy = os.userInfo().username;

  const content = [
    `Browser=${browser.charAt(0).toUpperCase() + browser.slice(1)}`,
    `Environment=${environment}`,
    `Executed By=${executedBy}`,
    `Framework=${framework.charAt(0).toUpperCase() + framework.slice(1)}`
  ].join('\n');

  fs.writeFileSync(
    path.resolve(__dirname, '../.env.test/environment.properties'),
    content
  );

  console.log('Generated environment.properties:');
  console.log(content);
}

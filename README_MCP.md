# MCP (Model Context Protocol) with Playwright

## What is Playwright-MCP?

**Playwright-MCP** combines Playwright's automation capabilities with AI-powered test generation through the Model Context Protocol. This integration allows you to generate intelligent test scripts using AI prompts and execute them with Playwright's robust testing framework.

---

## 🚀 Playwright-MCP Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v22.13.1 recommended)
- [VS Code](https://code.visualstudio.com/) with **GitHub Copilot extension**
- Active **GitHub Copilot subscription** or AI assistant access
- Dynamics 365 test environment access

### Step 1: Install Playwright with MCP Support

```sh
# Install core dependencies
npm install playwright @playwright/test
npm install -D typescript @types/node
npm install dotenv winston allure-playwright

# Install Playwright browsers
npx playwright install chromium
```

### Step 2: Configure Playwright for MCP

Create MCP-optimized Playwright configuration:

```typescript
// filepath: playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './MCP/spec',
  timeout: 300000, // Extended timeout for AI processing
  retries: 2, // Extra retries for AI learning
  workers: 1, // Sequential execution for MCP
  
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  
  use: {
    baseURL: process.env.DYNAMICS_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 30000, // Extended for Dynamics 365
  },

  projects: [
    {
      name: 'mcp-tests',
      use: { 
        channel: 'chrome',
        launchOptions: {
          args: ['--disable-web-security']
        }
      },
    },
  ],
});
```

### Step 3: Setup Environment Configuration

```bash
# filepath: .env
DYNAMICS_URL=https://your-test-org.crm.dynamics.com
DYNAMICS_USERNAME=test.user@yourorg.com
DYNAMICS_PASSWORD=your-test-password

# MCP Settings
MCP_AI_TIMEOUT=45000
MCP_DEBUG_MODE=true
```

### Step 4: Add MCP Scripts to package.json

## Step 5: MCP File Structure

### Core Files
- **`.env-mcp`** - Environment configuration with Dynamics 365 credentials and URLs for MCP tests
- **`README.md`** - Comprehensive documentation for MCP setup, usage, and AI prompt integration

### Configuration Files  
- **`playwright.config.mcp.ts`** - Dedicated Playwright configuration for MCP tests with optimized settings (located in root)

### Directories

#### `pages/` - Page Object Model Classes
- **`loginPage.ts`** - Handles Microsoft authentication flow with enhanced selectors and error handling
- **`casePage.ts`** - Comprehensive Dynamics 365 case operations including create, edit, resolve, and search functionality

#### `setup/` - Authentication Setup
- **`auth.setup.ts`** - One-time authentication setup that creates reusable storage state for all tests

#### `spec/` - Test Specifications  
- **`cases.spec.ts`** - Main test suite with 3 core tests: case creation, resolution, and editing with full validation

#### `storage-state/` - Authentication Persistence
- **`storageState.json`** - Saved authentication state from setup to avoid repeated logins during test execution

#### `artifacts/` - Test Output
- Generated screenshots, videos, and trace files from test runs for debugging and reporting

#### `MCP-testcontexts/` - AI Context Files
- Additional context files used by AI assistants for better test generation and understanding


```json
{
  "scripts": {
    "test:MCP": "npx playwright test --config=playwright.config.mcp.ts",
    "test:setupMCP": "npx playwright test --config=playwright.config.mcp.ts --project=setup",
    "test:allureMCP": "npx playwright test --config=playwright.config.mcp.ts --reporter=allure-playwright"
  }
}
```

### Step 6: Verify Setup

```sh
# Test the setup
npm run test:mcp:headed
```

---
### AI Agents: GPT and Claude

While GitHub Copilot is integrated directly into VS Code, you can also use external AI agents like **ChatGPT** and **Claude** for MCP test generation. Each has unique strengths for different aspects of test automation.

#### **AI Agent Comparison for MCP Testing:**

| AI Agent | Strengths | Best Use Cases | Integration Method |
|----------|-----------|----------------|-------------------|
| **GitHub Copilot** | VS Code integration, project context | Real-time coding, inline suggestions | Built-in VS Code extension |
| **ChatGPT (GPT-4)** | Code reasoning, complex logic | Architectural decisions, complex test flows | Web interface, API integration |
| **Claude Sonnet(Anthropic)** | Long context, detailed analysis | Large prompt processing, comprehensive suites | Web interface, API integration |


## 🤖 AI Prompts for Script Generation

### Available Prompt Files

The MCP solution includes specialized AI prompts for generating Playwright test scripts:

#### **Web Test Context Configuration** (`webtextcontext.txt`)
This file contains specialized instructions for AI agents to generate Playwright tests for Dynamics 365

```
├── Complete-Dynamics365_Automation_Prompt.md     # Master prompt for all scenarios
├── Dynamics365_Case_Creation_Prompt.md           # Case creation test generation
├── Dynamics365_Case_Edit_Prompt.md               # Case editing test generation
├── Dynamics365_Case_Resolution_Prompt.md         # Case resolution test generation
└── Dynamics365_RealTime_Challenges.md            # Known issues and solutions
```

### How to Use Prompts to Generate Scripts

#### Method 1: GitHub Copilot Integration

1. **Open VS Code** with your MCP project

2. **Configure Copilot Chat Settings**:
   - Open GitHub Copilot Chat (Ctrl+Shift+I)
   - **Select the appropriate agent** using the `@` symbol:
     ```
     @workspace  # For project-wide context and file awareness
     @vscode     # For VS Code specific help and commands
     @terminal   # For command line and script assistance
     ```

3. **Choose the right mode** for your testing needs:
   ```
   # For test generation with full project context
   @workspace /explain
   
   # For fixing existing test code
   @workspace /fix
   
   # For generating new test files
   @workspace /new
   
   # For terminal commands and script execution
   @terminal
   ```

4. **Load the prompt** you want to use:
   ```sh
   # Open the master prompt
   code Complete-Dynamics365_Automation_Prompt.md
   ```

5. **Copy the prompt content** (Ctrl+A, Ctrl+C)

6. **Use Copilot Chat with optimal agent and mode**:
   ```
   @workspace /new
   
   [Paste the complete prompt here]
   
   Now generate a Playwright test that:
   - Creates a new case with priority "High"
   - Assigns it to a specific user
   - Validates all required fields
   - Includes proper error handling
   - Use the existing project structure and imports
   ```

7. **Copy the generated code** to your spec file:
   ```typescript
   // MCP/spec/ai-generated-case.spec.ts
   // [Generated Playwright test code will appear here]
   ```

### Copilot Chat Agents and Modes Reference

#### **Available Agents:**

| Agent | Use Case | Best For |
|-------|----------|----------|
| `@workspace` | Project-aware assistance | Test generation, file creation, project-specific help |
| `@vscode` | VS Code functionality | Extension help, settings, debugging |
| `@terminal` | Command line assistance | npm scripts, Playwright commands, file operations |

#### **Available Modes:**

| Mode | Purpose | Example Usage |
|------|---------|---------------|
| `/explain` | Code explanation | `@workspace /explain` - Understand existing test structure |
| `/fix` | Bug fixing | `@workspace /fix` - Fix failing test cases |
| `/new` | Create new files | `@workspace /new` - Generate new test specifications |
| `/tests` | Generate unit tests | `@workspace /tests` - Create test cases for existing code |
| `/doc` | Documentation | `@workspace /doc` - Generate documentation for test files |

#### **Optimal Combinations for MCP Testing:**

```bash
# For generating new MCP test files
@workspace /new "Create a Playwright test for Dynamics 365 case management"

# For explaining existing MCP tests
@workspace /explain MCP/spec/cases.spec.ts

# For fixing failing MCP tests
@workspace /fix "The case creation test is failing on selector timeout"

# For generating test documentation
@workspace /doc "Document the MCP test suite structure and usage"

# For terminal commands and setup
@terminal "How do I run MCP tests with Allure reporting?"
```

### Advanced Copilot Chat Usage for MCP

#### **Context-Aware Test Generation:**

```
@workspace /new

I have these prompt files in my project:
- Complete-Dynamics365_Automation_Prompt.md
- Dynamics365_Case_Creation_Prompt.md
- Dynamics365_Case_Edit_Prompt.md

Using the content from Complete-Dynamics365_Automation_Prompt.md, generate a comprehensive Playwright test suite for Dynamics 365 case management that includes:
- Case creation with different priorities
- Case assignment to team members
- Case resolution workflows
- Error handling for network timeouts
- Popup management for AI assistants

Please use the existing project structure in MCP/spec/ and follow the patterns in the current test files.
```

#### **Iterative Test Improvement:**

```
@workspace /fix

The following MCP test is failing with timeout errors:

[Paste your test code here]

Based on the Dynamics365_RealTime_Challenges.md file in the project, please:
1. Add proper wait strategies for Dynamics 365 loading
2. Include popup dismissal logic
3. Add retry mechanisms for flaky selectors
4. Optimize the test for better reliability
```

#### **Project-Specific Customization:**

```
@workspace /explain

Please analyze the current MCP test structure and help me understand:
1. How the existing tests handle authentication
2. What patterns are used for element selection
3. How error handling is implemented
4. What improvements can be made based on the prompt files

Then suggest enhancements for our specific Dynamics 365 environment.
```

### Copilot Chat Best Practices for MCP

#### **✅ Effective Prompting:**

```bash
# Good: Specific agent + mode + context
@workspace /new "Generate MCP test using Dynamics365_Case_Creation_Prompt.md for high-priority cases"

# Good: Reference existing project files
@workspace /fix "Update cases.spec.ts to handle popups mentioned in Dynamics365_RealTime_Challenges.md"

# Good: Clear requirements with context
@workspace /explain "How does the current MCP authentication work in global-setup.ts?"
```

#### **❌ Ineffective Prompting:**

```bash
# Bad: No agent specified
"Create a test for cases"

# Bad: Too vague
@workspace "Help with testing"

# Bad: No project context
@vscode "Generate Playwright tests"
```

#### **Pro Tips for MCP with Copilot:**
1. **Always use `@workspace`** for test generation to get project context
2. **Reference specific prompt files** in your requests
3. **Use `/new` mode** for creating new test scenarios
4. **Use `/fix` mode** when tests are failing
5. **Combine multiple prompt files** for comprehensive scenarios:

```
@workspace /new

Combine the context from these files:
1. Complete-Dynamics365_Automation_Prompt.md (base automation knowledge)
2. Dynamics365_Case_Resolution_Prompt.md (specific resolution scenarios)
3. Dynamics365_RealTime_Challenges.md (known issues and solutions)

Generate a robust test suite for case resolution that handles all the timing and popup challenges mentioned in the challenges document.
```

### Quick Copilot Commands for MCP Development

```bash
# Generate new MCP test with full context
@workspace /new "MCP test for [scenario] using [prompt-file.md]"

# Fix existing MCP test issues
@workspace /fix "MCP test failing due to [specific error]"

# Explain MCP test patterns
@workspace /explain MCP/spec/cases.spec.ts

# Get terminal commands for MCP
@terminal "Run MCP tests with specific configuration"

# Generate test documentation
@workspace /doc "Document MCP test suite for team onboarding"
```

---

## Validation and Testing

### Verify Your Setup

```sh
# 1. Check if prompts are available
ls MCP/*_Prompt.md

# 2. Verify Playwright configuration
npx playwright test --list

# 3. Test AI-generated script execution
npm run test:mcp:headed

# 4. Generate and view reports
npm run test:mcp:allure
```

### Next Steps

1. **Choose appropriate prompts** for your testing scenarios
2. **Generate initial test scripts** using AI assistants
3. **Customize generated code** for your environment
4. **Execute and validate** the AI-generated tests
5. **Iterate and improve** based on results

The combination of Playwright's robust automation capabilities with AI-powered script generation through MCP prompts provides a powerful solution for Dynamics 365 test automation.
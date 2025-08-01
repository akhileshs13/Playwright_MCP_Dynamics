# Dynamics 365 Case Creation Automation Framework

Create a comprehensive Playwright TypeScript automation framework for Dynamics 365 Customer Service that handles case creation workflow with authentication and validation.

## Framework Requirements

### Environment Configuration & Authentication

**Environment Setup:**
- `.env` file configuration with environment variables for URL, credentials, and settings
- Support for multiple environments (DEV, TEST, PROD) with environment-specific configurations
- Secure credential management with dotenv integration
- Configurable timeouts and retry settings per environment

```
.env file structure:
DY_URL=https://yourorg.crm.dynamics.com
DY_USERNAME=your.username@domain.com
DY_PASSWORD=your_secure_password
TEST_TIMEOUT=30000
BROWSER_HEADLESS=false
SCREENSHOT_ON_FAILURE=true
```

**Authentication System:**
- Automated Microsoft/Azure AD login with username/password authentication
- Multi-factor authentication handling where applicable
- Session persistence and storage state management
- Login failure detection and retry mechanisms
- Post-login navigation verification and dashboard detection

### Case Creation Workflow

**Case Creation Process:**
- Environment-based authentication and navigation to case creation form
- Comprehensive popup and dialog management (Copilot suggestions, form assistants, teaching bubbles)
- Subject selection using enhanced dropdown strategies with multiple fallback selectors
- Customer selection via search icon → Advanced lookup → radio button selection → completion with validation
- Origin dropdown selection with dynamic value detection and change validation
- Auto-generated unique case titles with timestamp-based random numbers for uniqueness
- Form completion with descriptions and robust save functionality
- Search filter-based validation to confirm case creation with multiple verification strategies
- Case title persistence verification and grid search validation

### Technical Implementation

**Environment Management:**
- Environment variable validation and error handling
- Support for different Dynamics 365 environments and configurations
- Secure credential handling with proper encryption considerations
- Configuration loading with dotenv and environment-specific overrides

**Authentication Implementation:**
- Microsoft login page detection and interaction
- Username and password field identification with multiple selector strategies
- "Next" and "Sign in" button handling with proper wait conditions
- Session state persistence using Playwright's storage state
- Login verification through dashboard or main page detection

**Robust Element Handling:**
- Multi-tier selector strategies using data attributes, ARIA labels, roles, and CSS selectors
- Force-click capabilities for intercepted elements with retry mechanisms
- Comprehensive popup and dialog management (Copilot, AI suggestions, teaching bubbles)
- Form assistant and mailto link prevention with event listeners
- Dynamic element waiting with multiple fallback strategies

### Framework Architecture

**Required Project Structure:**
```
/MCP
  /pages
    - loginPage.ts (Authentication handling)
    - casePage.ts (Case creation methods)
  /spec
    - caseCreation.spec.ts (Creation test suite)
  /storage-state
    - Authentication session persistence
  .env (Environment configuration)
```

### Expected Behavior

**Authentication Test Foundation:**
- Automatic environment variable loading and validation
- Microsoft login page detection and successful authentication
- Dynamics 365 Customer Service hub navigation and verification
- 30-60 second authentication completion with reliable session establishment

**Case Creation Test:**
- Complete automated case creation from login to validation
- Subject selection with fallback strategies, customer via advanced lookup
- Origin dropdown selection with dynamic value detection
- Unique case generation with timestamp-based titles and search validation
- Comprehensive popup dismissal and form completion
- 3-4 minute execution with 100% success rate and detailed logging

### Quality Standards

**Reliability Features:**
- Network timeout handling with configurable retry mechanisms
- Clean data extraction without duplication artifacts
- Direct URL navigation fallbacks for robust page access
- Comprehensive error logging with timestamped debug information

**Security Considerations:**
- Secure environment variable handling with .env file protection
- Credential encryption and secure storage practices
- Prevention of credential exposure in logs and screenshots

Generate a complete, production-ready case creation automation framework with enterprise reliability standards and comprehensive error recovery mechanisms.

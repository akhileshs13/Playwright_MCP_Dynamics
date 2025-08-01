# Dynamics 365 Case Management Automation Framework

Create a comprehensive Playwright TypeScript automation framework for Dynamics 365 Customer Service that handles complete case lifecycle management including authentication, navigation, case creation, editing, and resolution workflows.

## Framework Requirements

### Environment Configuration & Authentication

**Environment Setup:**
- `.env` file configuration with environment variables for URL, credentials, and settings
- Support for multiple environments (DEV, TEST, PROD) with environment-specific configurations
- Secure credential management with dotenv integration
- Configurable timeouts and retry settings per environment
- Browser configuration options (headless/headed modes)

**Authentication System:**
- Automated Microsoft/Azure AD login with username/password authentication
- Multi-factor authentication handling where applicable
- Session persistence and storage state management
- Login failure detection and retry mechanisms
- Post-login navigation verification and dashboard detection
- Cookie and session management for subsequent test runs

**Navigation Framework:**
- Dynamics 365 main app navigation with sitemap handling
- Customer Service hub navigation and module detection
- Cases entity navigation with direct URL fallbacks
- Breadcrumb and navigation state verification
- Page load completion detection with proper wait strategies

### Core Workflows

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

**Case Edit Process with Origin Validation:**
- Navigation to active cases and case selection for editing via checkbox selection
- Case opening through direct link navigation with title verification
- Current field value capture before modifications (especially origin field)
- Field modification including description updates and origin dropdown changes
- Dynamic origin selection ensuring different value from current (Email, Phone, Web priority)
- Old vs new value comparison and validation logging
- Save and close functionality with change persistence verification
- Re-opening case to validate applied changes with comprehensive field validation
- Before/after value comparison reporting and change confirmation
- Verification of updated field values with detailed validation logging

**Case Resolution Process:**
- Navigation to active cases view and case grid interaction with proper loading waits
- Case selection using checkbox-based grid selection with title extraction
- Case opening through title link navigation with details page verification
- Resolution workflow initiation with "Resolve Case" button detection
- Resolution dialog handling with enhanced field detection strategies
- Resolution text input with predefined resolution messages and field validation
- Resolution completion with proper dialog closure and status verification
- Confirmation of resolved status display and active cases list validation
- Verification that resolved cases are removed from active cases view

### Technical Implementation

**Environment Management:**
- `.env` file structure with all required variables (DY_URL, DY_USERNAME, DY_PASSWORD)
- Environment variable validation and error handling
- Support for different Dynamics 365 environments and configurations
- Secure credential handling with proper encryption considerations
- Configuration loading with dotenv and environment-specific overrides

**Authentication Implementation:**
- Microsoft login page detection and interaction
- Username and password field identification with multiple selector strategies
- "Next" and "Sign in" button handling with proper wait conditions
- Two-factor authentication support where required
- Session state persistence using Playwright's storage state
- Login verification through dashboard or main page detection
- Automatic retry mechanisms for authentication failures
- Post-login navigation to Dynamics 365 Customer Service hub

**Robust Element Handling:**
- Multi-tier selector strategies using data attributes, ARIA labels, roles, and CSS selectors
- Force-click capabilities for intercepted elements with retry mechanisms
- Comprehensive popup and dialog management (Copilot, AI suggestions, teaching bubbles)
- Form assistant and mailto link prevention with event listeners
- External link interception and blocking to prevent navigation issues
- Dynamic element waiting with multiple fallback strategies
- Enhanced origin field detection with 25+ selector combinations

**Error Recovery & Resilience:**
- Graceful handling of non-critical field failures with test continuation
- Page navigation timeout recovery with multiple retry strategies
- Element interception workarounds with alternative interaction methods
- Detailed logging with visual indicators and step-by-step progress tracking
- Screenshot capture on critical failures with timestamped file names
- Network timeout handling with configurable retry counts
- Popup dismissal with comprehensive selector coverage

**Timing & Synchronization:**
- Appropriate wait strategies for different interaction types with configurable timeouts
- Dialog appearance detection and handling with proper loading indicators
- Dropdown population timing with dynamic content loading waits
- Form submission and navigation delays with completion verification
- Post-authentication navigation waits with page readiness detection
- Search result loading waits with grid refresh detection
- Element visibility and interactability verification before actions

### Framework Architecture

**Environment Configuration Structure:**
```
.env file structure:
DY_URL=https://yourorg.crm.dynamics.com
DY_USERNAME=your.username@domain.com
DY_PASSWORD=your_secure_password
TEST_TIMEOUT=30000
BROWSER_HEADLESS=false
SCREENSHOT_ON_FAILURE=true
```

**Authentication Page Object:**
- LoginPage class with comprehensive Microsoft authentication handling
- Username field detection and interaction methods
- Password field handling with secure input capabilities
- Sign-in button detection with multiple selector strategies
- Two-factor authentication support where applicable
- Post-login verification and navigation confirmation
- Session state management and storage capabilities

**Page Object Structure:**
- Centralized CasePage class with complete workflow methods including:
  - setupPopupPrevention() for dialog and popup management
  - navigateToCases() with multiple navigation strategies
  - fillCaseForm() with comprehensive field handling
  - editCase() with origin value capture and validation
  - resolveCase() with dialog interaction and status verification
- PageObjectManager for coordination and shared functionality
- Test setup utilities with environment configuration loading
- Global setup for browser configuration and authentication state

**Test Organization:**
- Separate test cases for authentication, creation, editing, and resolution workflows
- Environment configuration through .env files with variable validation
- Test data management with JSON configuration files
- Comprehensive test reporting with Allure integration
- Storage state management for session persistence
- Global setup and teardown with proper cleanup
- Parallel test execution capabilities with isolated test environments

### Expected Behavior

**Authentication Test Foundation:**
- Automatic environment variable loading and validation
- Microsoft login page detection and successful authentication
- Dynamics 365 Customer Service hub navigation and verification
- Session state persistence for subsequent test runs
- Login failure detection with appropriate error messaging
- 30-60 second authentication completion with reliable session establishment

**Case Creation Test:**
- Complete automated case creation from login to validation
- Subject selection with fallback strategies, customer via advanced lookup
- Origin dropdown selection with dynamic value detection
- Unique case generation with timestamp-based titles and search validation
- Comprehensive popup dismissal and form completion
- 3-4 minute execution with 100% success rate and detailed logging

**Case Edit Test with Origin Validation:**
- Automated case selection and modification workflow with checkbox navigation
- Case opening and field editing capabilities with current value capture
- Description and origin field updates with old vs new value comparison
- Dynamic origin selection ensuring different values (Email, Phone, Web priority)
- Save and close operation with change persistence verification
- Case reopening and comprehensive validation of applied changes
- Before/after field value comparison with detailed validation logging
- 3-4 minute execution with complete change validation and reporting

**Case Resolution Test:**
- Automated case selection and resolution workflow with checkbox selection
- Case opening through title navigation with details verification
- Resolution dialog interaction with enhanced field detection
- Resolution text input and proper dialog closure with status confirmation
- Active cases list validation ensuring resolved cases are removed
- 2-3 minute execution with reliable completion and status verification

### Quality Standards

**Reliability Features:**
- Network timeout handling with configurable retry mechanisms
- Clean data extraction without duplication artifacts or title corruption
- Direct URL navigation fallbacks for robust page access
- Memory-efficient object management with proper cleanup
- Environment-specific configuration with secure credential handling
- Session state management for authentication persistence
- Comprehensive error logging with timestamped debug information

**Security Considerations:**
- Secure environment variable handling with .env file protection
- Credential encryption and secure storage practices
- Session timeout handling and automatic re-authentication
- Prevention of credential exposure in logs and screenshots
- Secure test data management with sanitized outputs

**Output Requirements:**
- Complete TypeScript framework with proper typing and interfaces
- Enterprise-grade error handling and recovery with detailed logging
- Comprehensive test reporting with execution screenshots and videos
- Headless and headed mode compatibility with configurable browser options
- Zero manual intervention requirement with full automation capabilities
- Storage state management for session persistence across test runs
- Environment configuration validation with clear error messaging
- Detailed execution logs with step-by-step progress tracking

### Implementation Specifications

**Required Project Structure:**
```
/MCP
  /pages
    - loginPage.ts (Authentication handling)
    - casePage.ts (Complete case lifecycle management)
    - pageObjectManager.ts (Page coordination)
  /spec
    - cases.spec.ts (Main test suite with all workflows)
  /test-data
    - Configuration files for test data
  /storage-state
    - Authentication session persistence
  .env (Environment configuration)
```

**Essential Methods to Implement:**
- LoginPage: login(), validateLogin(), handleTwoFactor()
- CasePage: setupPopupPrevention(), navigateToCases(), fillCaseForm(), editCase(), resolveCase()
- Validation: validateCaseCreatedWithSearch(), validateCaseEditsWithOriginComparison(), validateResolutionSuccess()
- Utility: getCurrentOriginValue(), selectDifferentOrigin(), closePopupsAndSuggestions()

Generate a complete, production-ready automation framework that handles authentication, case creation, editing with origin validation, and resolution workflows with enterprise reliability standards, comprehensive error recovery mechanisms, and detailed environment configuration management.

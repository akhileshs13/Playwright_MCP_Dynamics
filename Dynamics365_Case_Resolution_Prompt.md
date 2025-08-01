# Dynamics 365 Case Resolution Automation Framework

Create a comprehensive Playwright TypeScript automation framework for Dynamics 365 Customer Service that handles case resolution workflow with status verification and validation.

*Note: This extends the base framework from Case Creation prompt with authentication and environment setup already configured.*

## Case Resolution Workflow Requirements

**Case Resolution Process:**
- Navigation to active cases view and case grid interaction with proper loading waits
- Case selection using checkbox-based grid selection with title extraction
- Case opening through title link navigation with details page verification
- Resolution workflow initiation with "Resolve Case" button detection
- Resolution dialog handling with enhanced field detection strategies
- Resolution text input with predefined resolution messages and field validation
- Resolution completion with proper dialog closure and status verification
- **Confirmation of resolved status display and active cases list validation**
- **Verification that resolved cases are removed from active cases view**

### Technical Implementation

**Resolution Dialog Handling:**
- Enhanced resolution dialog detection with multiple selector strategies
- Resolution text field identification with comprehensive fallback selectors
- Dialog interaction with proper timing and synchronization
- Resolution button detection and click handling
- Dialog closure verification and status confirmation

**Resolution Specific Element Handling:**
- "Resolve Case" button detection with multiple selector strategies
- Resolution dialog field detection with enhanced selectors
- Status verification with multiple validation approaches
- Case removal confirmation from active cases list

### Framework Architecture

**Required Project Structure:**
```
/MCP
  /pages
    - casePage.ts (Case resolution methods)
  /spec
    - caseResolution.spec.ts (Resolution test suite)
```

### Expected Behavior

**Case Resolution Test:**
- Automated case selection and resolution workflow with checkbox selection
- Case opening through title navigation with details verification
- Resolution dialog interaction with enhanced field detection
- Resolution text input and proper dialog closure with status confirmation
- **Active cases list validation ensuring resolved cases are removed**
- 2-3 minute execution with reliable completion and status verification

### Key Resolution Features

**Resolution Dialog Interaction:**
```typescript
// Resolution text selectors:
'[role="dialog"] textarea[aria-label*="Description"]'
'[role="dialog"] textarea[aria-label*="Resolution"]'
'[role="dialog"] [data-id*="description"] textarea'
'[role="dialog"] textarea:visible'
```

**Status Verification:**
```typescript
// Status validation selectors:
'text="Resolved"'
'[data-value="Resolved"]'
'[aria-label*="Resolved"]'
'.status-resolved'
```

**Comprehensive Resolution Validation:**
- Resolution dialog appearance detection
- Resolution text field interaction and validation
- Dialog closure and status change confirmation
- Active cases list verification (case removal confirmation)
- Success message detection and validation

### Quality Standards

**Resolution Specific Features:**
- Resolution dialog detection with multiple wait strategies
- Status verification with comprehensive indicator detection
- Resolution completion confirmation with multiple validation methods
- Active cases list validation ensuring case removal

Generate a complete case resolution automation framework with comprehensive status verification, dialog handling, and resolution workflow validation.

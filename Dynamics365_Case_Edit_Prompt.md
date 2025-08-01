# Dynamics 365 Case Edit Automation Framework

Create a comprehensive Playwright TypeScript automation framework for Dynamics 365 Customer Service that handles case editing workflow with origin validation and field comparison.

*Note: This extends the base framework from Case Creation prompt with authentication and environment setup already configured.*

## Case Edit Workflow Requirements

**Case Edit Process:**
- Navigation to active cases and case selection for editing via checkbox selection
- Case opening through direct link navigation with title verification
- **Current field value capture before modifications (especially origin field)**
- Field modification including description updates and origin dropdown changes
- **Dynamic origin selection ensuring different value from current (Email, Phone, Web priority)**
- **Old vs new value comparison and validation logging**
- Save and close functionality with change persistence verification
- Re-opening case to validate applied changes with comprehensive field validation
- **Before/after value comparison reporting and change confirmation**
- Verification of updated field values with detailed validation logging

### Technical Implementation

**Enhanced Origin Field Handling:**
- `getCurrentOriginValue()` method to capture current origin before editing
- `selectDifferentOrigin()` method with priority ordering (Email, Phone, Web)
- 25+ selector combinations for robust origin field detection
- Dynamic dropdown interaction with value change detection
- Old vs new value comparison with detailed logging

**Case Edit Specific Element Handling:**
- Checkbox-based case selection with title extraction
- Case form field modification with current value capture
- Enhanced field validation with before/after comparison
- Save and close functionality with persistence verification

### Framework Architecture

**Required Project Structure:**
```
/MCP
  /pages
    - casePage.ts (Case edit methods with origin validation)
  /spec
    - caseEdit.spec.ts (Edit test suite)
```

### Expected Behavior

**Case Edit Test with Origin Validation:**
- Automated case selection and modification workflow with checkbox navigation
- Case opening and field editing capabilities with current value capture
- **Description and origin field updates with old vs new value comparison**
- **Dynamic origin selection ensuring different values (Email, Phone, Web priority)**
- Save and close operation with change persistence verification
- Case reopening and comprehensive validation of applied changes
- **Before/after field value comparison with detailed validation logging**
- 3-4 minute execution with complete change validation and reporting

### Key Validation Features

**Origin Change Validation:**
```typescript
// Example validation output:
🔄 Current Origin: "Phone" → New Origin: "Email"
📊 Expected Description: "Updated case description - automated edit test"
✅ Description: PASSED (Found: "Updated case description - automated edit test")
✅ Origin Change: PASSED (Old: "Phone" → New: "Email")
🎯 Overall Validation: PASSED
```

**Comprehensive Field Validation:**
- Current value capture before any modifications
- Dynamic selection of different origin values
- Detailed before/after comparison logging
- Field persistence verification after save/reload
- Change confirmation with validation summary

### Quality Standards

**Origin Validation Specific Features:**
- Origin field detection with 25+ fallback selectors
- Dynamic value selection with priority ordering
- Comprehensive change validation and reporting
- Before/after value comparison with exact matching

Generate a complete case editing automation framework with comprehensive origin validation, old vs new value comparison, and change verification capabilities.

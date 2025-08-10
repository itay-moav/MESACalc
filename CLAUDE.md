# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint with React-specific rules
- `npm run preview` - Preview production build
- `npx shadcn@latest add [component]` - Add new ShadCN UI components

## Testing Commands

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:watch` - Run tests in watch mode (alias for `npm test`)

## Project Architecture

This is a React-based MESA risk calculator application called "mesa-risk".

### MESA Risk Calculation Algorithm

**⚠️ CRITICAL**: This application implements validated clinical algorithms. Do NOT modify risk calculation logic without medical/statistical expertise.

For detailed information about the MESA CHD risk calculation algorithm, mathematical formulas, and clinical implementation, see [`MESA-CALCULATOR.md`](./MESA-CALCULATOR.md). This document contains the complete algorithm specification based on the Multi-Ethnic Study of Atherosclerosis research.

#### Algorithm Source Documentation (`MESA-SOURCE-LOGIC/`)

The risk calculation implementation is based on authoritative MESA study materials:

1. **Primary Research Paper**: 
   - ScienceDirect publication (J Am Coll Cardiol. 2015): "10-Year Coronary Heart Disease Risk Prediction Using Coronary Artery Calcium and Traditional Risk Factors"
   - File reference: `logi2.pdf` source link

2. **Technical Implementation Guide**:
   - Official MESA calculated variables documentation from mesa-nhlbi.org
   - File: `logic-code` - Contains SPSS syntax and computational algorithms
   - **Key Implementation Details**:
     - Variable encoding schemas (gender: male=1, female=0)
     - Ethnicity coding (1=White, 2=Chinese, 3=African American, 4=Hispanic)
     - Boolean field mappings (yes=1, no=0)
     - Mathematical formulas with exact coefficients
     - Baseline survival probabilities by model type

3. **Algorithm Coefficients**:
   ```javascript
   // With CAC Model Coefficients (src/utils/mesaCalculation.js)
   const MESA_WITH_CAC = {
     baselineSurvival: 0.99833,
     coefficients: {
       age: 0.0172, gender: 0.4079, chinese: -0.3475,
       black: 0.0353, hispanic: -0.0222, diabetes: 0.3892,
       smoking: 0.3717, totalCholesterol: 0.0043,
       hdlCholesterol: -0.0114, // ... etc
       cac: 0.2743 // ln(CAC + 1) coefficient
     }
   };
   ```

#### Critical Implementation Notes for AI Agents:

- **Data Validation**: All input values must be within clinical ranges (age 45-85, CAC 0-2000, etc.)
- **Ethnicity Handling**: White/Caucasian serves as reference group (all ethnicity variables = 0)
- **CAC Processing**: Always use `ln(CAC + 1)` transformation, never raw CAC score
- **Risk Bounds**: Final risk percentages are clamped between 0-100%
- **Dual Models**: Always calculate both with-CAC and without-CAC estimates
- **Medical Context**: Results should include appropriate clinical disclaimers

#### Testing Validation:
- **Manual test scenarios** documented in `MANUAL-TESTS/` (see detailed section below)
- **Automated tests** verify coefficient accuracy and edge cases
- **URL parameter parsing** supports clinical workflow integration

### Core Architecture

- **Frontend Framework**: React 19 with Vite build tool
- **UI Components**: ShadCN UI with "New York" style and neutral color theme
- **Styling**: Tailwind CSS 4.0 with custom `furia.css` (includes ShadCN theme variables)
- **Base Path**: Application serves from `/mesa-risk` route
- **Port**: Development server runs on port 3001

### Key Services

1. **HTTP Service** (`src/services/http.js`)
   - Axios-based HTTP client with interceptors
   - Network error handling with "ERR_NETWORK" detection
   - Includes `fastApiWrapper` for API response validation
   - `responsePromiseChainHandler` for promise chain management
   - **Note**: Currently configured for future API integration, not actively used in risk calculations

2. **Logging Service** (`src/services/log.js`)
   - Configurable log levels (DEBUG, INFO, WARNING, ERROR, FATAL)
   - Console-based logging handler
   - Uses localStorage for debug mode and level configuration
   - Emergency debug mode with UUID key: `cef8d978-169e-4759-bddf-18b06007f11e`

### Configuration

- Environment variables loaded via `src/utilities/config.js` from Vite env vars:
  - `VITE_APP_LOG_HANDLER` - Sets logging handler (CONSOLE)
  - `VITE_APP_LOG_LEVEL` - Sets minimum log level (0-4)
- Development environment file: `developer.env` with default settings

### ShadCN UI Integration

- **Components Location**: `src/components/ui/` - All ShadCN UI components
- **Utility Functions**: `src/lib/utils.js` - Contains `cn()` function for class merging
- **Configuration**: `components.json` - ShadCN configuration with aliases and settings
- **Import Aliases**: `@/` prefix for clean imports (configured in `jsconfig.json` and `vite.config.js`)
- **Icon Library**: Lucide React for consistent iconography
- **Theme**: CSS variables in `furia.css` for light/dark mode support

### Build Configuration

- Vite config exposes `__APP_VERSION__` and `__APP_NAME__` globally
- Path aliases configured: `@/` maps to `./src/`
- Tailwind configured for all JS/JSX/TS/TSX files in src/
- ESLint setup with React hooks and refresh plugins
- ShadCN components use Radix UI primitives with Tailwind styling

## Query Parameter Support

The MESA Risk Calculator supports URL query parameters to pre-populate form fields. This allows for bookmarking, sharing, and automated testing of specific scenarios.

### Supported Parameters

#### Demographics
- `gender` or `sex` - Gender (`male`/`m` or `female`/`f`)
- `age` - Age in years (45-85)
- `race` or `ethnicity` - Race/ethnicity (`caucasian`/`white`/`1`, `chinese`/`2`, `african american`/`black`/`aa`/`3`, `hispanic`/`latino`/`4`)

#### Medical History (Yes/No fields)
- `diabetes` - Has diabetes (`yes`/`y`/`true`/`1` or `no`/`n`/`false`/`0`)
- `smoking` or `smoke` - Currently smoking
- `familyHistory`, `family`, or `fh` - Family history of heart attack

#### Laboratory Values
- `calcification`, `calc`, or `cac` - Coronary artery calcification score (0-2000)
- `totalCholesterol`, `tchol`, or `tc` - Total cholesterol in mg/dL (100-400)
- `hdlCholesterol` or `hdl` - HDL cholesterol in mg/dL (20-100)
- `systolicBP`, `sbp`, or `bp` - Systolic blood pressure in mmHg (90-200)

#### Medications (Yes/No fields)
- `lipidMedication`, `lipid`, or `statin` - Taking lipid-lowering medication
- `hypertensionMedication`, `htn`, or `bp` - Taking hypertension medication

### Example URLs

- Basic: `?age=57&sex=m`
- Comprehensive: `?gender=male&age=70&calcification=500&race=caucasian&diabetes=yes&smoking=no&totalCholesterol=250&hdl=40&systolicBP=140`
- Alternative names: `?sex=f&calc=200&fh=yes&statin=no&htn=yes`

See `test-urls.md` for extensive examples.

### Testing

The query parameter functionality includes comprehensive tests:
- **Integration tests**: `src/test/queryParams-integration.test.jsx` - Tests overall functionality
- **Test scenarios**: `test-urls.md` - Manual testing scenarios with sample URLs
- Run tests with `npm run test:run`

## MESA Source Logic Analysis Summary

The `MESA-SOURCE-LOGIC/` folder contains the authoritative source materials for this risk calculator implementation:

### Contents Analysis:
1. **README.md**: References to primary research paper and technical documentation sources
2. **logi2.pdf**: Reference to J Am Coll Cardiol 2015 publication on ScienceDirect
3. **logic-code**: Complete SPSS syntax and variable creation algorithms from mesa-nhlbi.org

### Key Findings:
- **Validated Coefficients**: All risk calculation coefficients match published MESA study values
- **Multi-Model Architecture**: Implements both CAC-enhanced and traditional risk models
- **Clinical Variables**: Comprehensive variable encoding matching original MESA study protocols
- **Quality Assurance**: Source documentation enables verification of implementation accuracy

### Implementation Integrity:
The current calculator (`src/utils/mesaCalculation.js`) faithfully implements the algorithms documented in the source materials, ensuring clinical validity and research compliance.

## Manual Testing Suite (`MANUAL-TESTS/`)

**⚠️ CRITICAL**: Always run manual tests after any changes to risk calculation logic.

### Test Suite Overview

**Files in MANUAL-TESTS/**:
1. **`expected-results.md`** - Detailed expected outcomes with manual calculations
2. **`test-calculation.js`** - Node.js script for coefficient validation  
3. **`test-patients.md`** - 25 comprehensive patient scenarios
4. **`test-urls.md`** - URL parameter parsing and validation tests

### Key Test Scenarios for AI Agents

**Before modifying risk calculations, verify these scenarios work correctly:**

```javascript
// Test Patient 1: Young Low-Risk Female (Expected: ~6.9% with CAC)
?gender=female&age=45&calcification=0&race=caucasian&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=160&hdl=65&systolicBP=105&lipidMedication=no&hypertensionMedication=no

// Test Patient 2: High-Risk Male (Expected: >40% with CAC)  
?gender=male&age=84&calcification=1500&race=caucasian&diabetes=yes&smoking=yes&familyHistory=yes&totalCholesterol=320&hdl=28&systolicBP=180&lipidMedication=no&hypertensionMedication=no

// Test Patient 3: Chinese Ethnicity (Expected: Lower risk due to coefficient)
?gender=male&age=63&calcification=120&race=chinese&diabetes=no&smoking=no&familyHistory=no&totalCholesterol=205&hdl=45&systolicBP=135&lipidMedication=no&hypertensionMedication=no
```

### Critical Validation Points

**✅ Must Pass**:
- CAC=0 reduces risk vs traditional factors alone
- Chinese ethnicity coefficient (-0.3475) lowers risk appropriately  
- Female patients show lower baseline risk than equivalent males
- Risk increases appropriately with age progression
- Coronary age correlates with calculated risk level
- Risk values remain within clinically reasonable bounds (0-50%)

**❌ Implementation Errors**:
- Static hardcoded values regardless of inputs
- Risk doesn't respond to parameter changes
- Unreasonable risk values (>100% or negative)
- CAC=0 doesn't provide protective effect
- Ethnicity coefficients not applied correctly

### Testing Protocol for AI Agents

1. **Before Changes**: Document current test results from `expected-results.md`
2. **After Changes**: Re-run all manual test scenarios
3. **Validation**: Compare results against expected ranges
4. **Coefficient Check**: Verify `test-calculation.js` still produces expected values
5. **Edge Cases**: Test minimum/maximum parameter values

### Development Testing Commands

```bash
# Start development server
npm run dev

# Run automated tests
npm run test:run

# Manual coefficient validation
node MANUAL-TESTS/test-calculation.js

# Test specific patient scenario
# Copy URL from test-patients.md or test-urls.md
```

**Remember**: The manual tests are designed to catch implementation errors that automated tests might miss, particularly around clinical accuracy and coefficient application.

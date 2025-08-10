# MESA Risk Calculator

A web-based MESA (Multi-Ethnic Study of Atherosclerosis) risk calculator application for 10-year coronary heart disease risk prediction.

## Overview

This application implements the MESA CHD risk prediction algorithm published in the Journal of the American College of Cardiology (2015). It provides personalized cardiovascular risk assessment incorporating traditional risk factors and coronary artery calcification (CAC) scores.

## Scientific Foundation

### Source Materials

The implementation is based on authoritative MESA study documentation located in the `MESA-SOURCE-LOGIC/` folder:

- **Primary Reference**: ScienceDirect publication ([link](https://www.sciencedirect.com/science/article/pii/S0735109715049761)) - *10-Year Coronary Heart Disease Risk Prediction Using Coronary Artery Calcium and Traditional Risk Factors*
- **Technical Implementation**: MESA calculated variables documentation from mesa-nhlbi.org providing detailed SPSS syntax and computational algorithms
- **Algorithm Documentation**: Comprehensive variable creation logic and statistical methodologies

### Key Features

- **Dual Risk Models**: Calculates risk both with and without CAC incorporation
- **Multi-Ethnic Validation**: Derived from diverse population including White, Chinese, African American, and Hispanic participants
- **Traditional Risk Factors**: Age, gender, ethnicity, diabetes, smoking, cholesterol levels, blood pressure, medications, family history
- **Advanced Imaging**: Optional coronary artery calcification scoring for enhanced prediction accuracy
- **Comparative Analysis**: Shows how CAC improves risk prediction over traditional factors alone

### Clinical Significance

The MESA risk calculator represents a significant advancement in cardiovascular risk prediction by:
- Including ethnicity-specific risk adjustments
- Demonstrating the added value of CAC scoring
- Providing more accurate risk stratification than traditional Framingham models
- Supporting clinical decision-making for primary prevention strategies

## Technical Implementation

The calculator processes patient data through validated algorithms that compute:
1. Linear risk estimates using published coefficients
2. 10-year CHD probability calculations
3. Coronary age estimation
4. Risk categorization and clinical recommendations

For detailed technical specifications, see [MESA-CALCULATOR.md](./MESA-CALCULATOR.md).

## Quality Assurance & Testing

The MESA Risk Calculator includes comprehensive testing infrastructure to ensure accuracy and reliability:

### Manual Testing Suite (`MANUAL-TESTS/`)

**Comprehensive Test Coverage**:
- **25 Patient Scenarios** covering diverse clinical profiles from low-risk young females to high-risk elderly males
- **Expected Results** with manual calculations for validation (`expected-results.md`)
- **URL Parameter Testing** with extensive query parameter combinations (`test-urls.md`)
- **Clinical Validation** scenarios testing ethnicity coefficients, CAC effects, and medication impacts

**Key Test Categories**:
- **Risk Stratification**: Validates proper risk scoring across patient demographics
- **Ethnicity Effects**: Tests Chinese (-0.3475), African American (+0.0353), and Hispanic (-0.0222) coefficients  
- **CAC Impact**: Verifies coronary calcification scoring effects (ln transformation)
- **Edge Cases**: Minimum/maximum ages, extreme CAC scores, parameter validation
- **URL Integration**: Tests query parameter parsing and form population

**Validation Criteria**:
- ✅ CAC=0 provides risk reduction vs traditional factors
- ✅ Ethnicity coefficients properly adjust risk calculations
- ✅ Female gender shows appropriate baseline risk differences
- ✅ Risk ranges remain clinically reasonable (0-50%)
- ✅ Coronary age calculations correlate with risk levels

### Automated Testing
- **Integration Tests**: Query parameter functionality (`src/test/queryParams-integration.test.jsx`)  
- **Unit Tests**: Risk calculation accuracy and edge case handling
- **Continuous Validation**: Ensures algorithm integrity across updates

### Development Testing
```bash
# Run all tests
npm run test:run

# Start development server for manual testing
npm run dev

# Test with sample patient URLs from MANUAL-TESTS/test-urls.md
```

The testing suite validates that the implementation matches published MESA coefficients and produces clinically appropriate risk assessments across diverse patient populations. 
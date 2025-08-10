import { useState, useEffect } from 'react';
import { getDefaultFormData, parseQueryParams } from '../utils/queryParams';
import { calculateMesaRisk } from '../utils/mesaCalculation';

/**
 * Custom React hook for managing MESA risk calculator form data and calculations
 * Handles form state, URL parameter parsing, risk calculations, and results display
 * @returns {Object} Form data state and handler functions
 */
export const useFormData = () => {
  const [formData, setFormData] = useState(getDefaultFormData());
  const [showResults, setShowResults] = useState(false);
  const [riskResults, setRiskResults] = useState(null);

  // Parse URL parameters on component mount
  useEffect(() => {
    const parsedData = parseQueryParams();
    setFormData(parsedData);
  }, []);

  /**
   * Handles the risk calculation when form is submitted
   */
  const handleCalculate = () => {
    const results = calculateMesaRisk(formData);
    setRiskResults(results);
    setShowResults(true);
  };

  /**
   * Resets the form to default values and clears results
   */
  const handleStartOver = () => {
    setFormData(getDefaultFormData());
    setShowResults(false);
    setRiskResults(null);
  };

  /**
   * Updates form data with new values while preserving existing data
   * @param {Object} newData - New form data to merge
   */
  const updateFormData = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  return {
    formData,
    showResults,
    riskResults,
    handleCalculate,
    handleStartOver,
    updateFormData,
    setFormData
  };
};
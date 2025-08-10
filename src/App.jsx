import { useFormData } from './hooks/useFormData';
import MesaRiskForm from './components/MesaRiskForm';

/**
 * Main App component for the MESA CHD Risk Calculator
 * Manages form state and passes data to the MesaRiskForm component
 * @returns {JSX.Element} The main application component
 */
export default function App() {
  const {
    formData,
    showResults,
    riskResults,
    handleCalculate,
    handleStartOver,
    updateFormData
  } = useFormData();

  /**
   * Function to get current form values for external access
   * @returns {Object} Current form data values
   */
  const getFormValues = () => {
    return { ...formData };
  };

  // Example usage: You can expose this function for external use
  // window.getFormValues = getFormValues; // Uncomment to make globally available
  
  // Or you can use it internally for calculations, logging, etc.
  // useEffect(() => {
  //   console.log('Current form values:', getFormValues());
  // }, [formData]);

  return (
    <MesaRiskForm
      formData={formData}
      updateFormData={updateFormData}
      showResults={showResults}
      riskResults={riskResults}
      onCalculate={handleCalculate}
      onStartOver={handleStartOver}
    />
  );
}

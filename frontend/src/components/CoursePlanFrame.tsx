import React, { useState } from 'react';

interface CoursePlanFrameProps {
  syllabus: string; // The syllabus data generated in the previous step
  coursePlan: string; // The course plan generated, if already available
  onBack: () => void; // Function to go back to the previous step
  onGenerate: (plan: string) => void; // Function to trigger course plan generation
}

const CoursePlanFrame: React.FC<CoursePlanFrameProps> = ({
  syllabus,
  coursePlan,
  onBack,
  onGenerate,
}) => {
  const [isGenerating, setIsGenerating] = useState(false); // Handle generation state
  const [generatedPlan, setGeneratedPlan] = useState(coursePlan || ''); // Course plan state

  // Simulate generating a course plan
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = `Course Plan based on: ${syllabus}`; // Here you can implement actual logic
      setGeneratedPlan(plan);
      onGenerate(plan); // Pass the generated plan to the parent component
      setIsGenerating(false);
    }, 2000); // Simulate a 2-second generation time
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Course Plan</h2>
      {isGenerating ? (
        <p>Generating course plan, please wait...</p>
      ) : (
        <>
          <p>{generatedPlan ? `Generated Plan: ${generatedPlan}` : 'No course plan generated yet.'}</p>
          {!generatedPlan && (
            <button style={generateButtonStyle} onClick={handleGeneratePlan}>
              Generate Course Plan
            </button>
          )}
        </>
      )}
      <div style={buttonContainerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          ← Back
        </button>
        {generatedPlan && (
          <button style={exportButtonStyle}>
            Export Course Plan
          </button>
        )}
      </div>
    </div>
  );
};

// Styles for the CoursePlanFrame
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  marginBottom: '20px',
};

const generateButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50', // Green color for the generate button
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const backButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#01A9C2',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const exportButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#FFA500', // Orange color for export
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
};

export default CoursePlanFrame;

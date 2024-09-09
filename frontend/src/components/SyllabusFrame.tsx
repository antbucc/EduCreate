import React, { useState } from 'react';

interface SyllabusFrameProps {
  analysis: string;
  levels: string[];
  onNext: (syllabus: string) => void;
  onBack: () => void;
}

const SyllabusFrame: React.FC<SyllabusFrameProps> = ({ analysis, levels, onNext, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
     // const isProduction = process.env.NODE_ENV === 'production';
      //const baseURL = isProduction ? 'https://backend-production-60c1.up.railway.app' : 'http://localhost:5002';
      const baseURL = 'https://backend-production-60c1.up.railway.app';
      const url = `${baseURL}/generateSyllabus`;

      const body = JSON.stringify(analysis);
      const transformed = transformInput(body, levels);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformed),
      });

      if (!response.ok) {
        throw new Error('Failed to generate syllabus');
      }

      const data = await response.json();
      console.log('SYLLABO: ' + JSON.stringify(data));
      onNext(data);
    } catch (error) {
      console.error('Error generating syllabus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function transformInput(inputString: string, selectedBloomLevels: string[]) {
    try {
      const parsedData = JSON.parse(inputString);
      const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'];
      const bloomLevelIndex = Math.max(
        ...selectedBloomLevels.map((level) => bloomLevels.indexOf(level)).filter((index) => index !== -1)
      );

      const { Prompt, ...rest } = parsedData;
      return {
        Analysis: rest,
        bloomLevel: bloomLevelIndex,
      };
    } catch (error) {
      console.error('Invalid JSON string:', error);
      return null;
    }
  }

  return (
    <div style={formContainerStyle}>
      <h2 style={headerStyle}>Generate Syllabus</h2>

      {/* Show loading spinner while syllabus is generating */}
      {isLoading && (
        <div style={loadingContainerStyle}>
          <div style={spinnerStyle}></div>
          <p>Generating syllabus, please wait...</p>
        </div>
      )}

      <div style={navigationButtonsStyle}>
        <button style={navButtonStyle} onClick={onBack} disabled={isLoading}>
          ← Back
        </button>
        <button onClick={handleSubmit} style={navButtonStyle} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Syllabus →'}
        </button>
      </div>
    </div>
  );
};

// Styles
const formContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  height: '600px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  marginBottom: '20px',
};

const navigationButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
};

const navButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#01A9C2',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

// Spinner Styles
const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
};

const spinnerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '6px solid rgba(0, 0, 0, 0.1)',
  borderTop: '6px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// CSS for spinner animation
const spinnerAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = spinnerAnimation;
document.head.appendChild(styleSheet);

export default SyllabusFrame;

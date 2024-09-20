import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PedagogicalFrameProps {
  framework: string;
  levels: string[];
  analysis: string;
  onNext: (generatedSyllabus: any) => void; // Pass generated syllabus to the next step
  onBack: () => void;
}

const PedagogicalFrame: React.FC<PedagogicalFrameProps> = ({
  framework: initialFramework,
  levels: initialLevels,
  analysis,
  onNext,
  onBack,
}) => {
  const [framework, setFramework] = useState<string>(initialFramework || 'Revised Bloom Taxonomy');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels || []);
  const [isLoading, setIsLoading] = useState(false); // Handle loading state
  const [isSyllabusReady, setIsSyllabusReady] = useState(false); // Manage when syllabus is ready
  const [generatedSyllabus, setGeneratedSyllabus] = useState(null); // Store the generated syllabus

  const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'];

  const handleFrameworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFramework(event.target.value);
  };

  // Ensure that all previous levels are selected when a higher one is chosen
  const handleLevelChange = (level: string) => {
    const levelIndex = bloomLevels.indexOf(level);
    if (levelIndex >= 0) {
      const newSelectedLevels = bloomLevels.slice(0, levelIndex + 1); // Select all levels up to and including the clicked one
      setSelectedLevels(newSelectedLevels);
    }
  };

  const handleSubmit = async () => {
    if (selectedLevels.length === 0) {
      // Show toast notification if no levels are selected
      toast.error('Please select at least one level before generating the syllabus.');
      return; // Prevent further action if no levels are selected
    }

    setIsLoading(true);


    // generate the syllabus
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const baseURL = isProduction ? 'https://backend-production-60c1.up.railway.app' : 'http://localhost:5002';
      const url = `${baseURL}/generateSyllabus`;

      const body = JSON.stringify(analysis);
      const transformed = transformInput(body, selectedLevels);
      // here filter only topics in the selected language
      const checkedAnalysis = processTopics(JSON.stringify(transformed));

    

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkedAnalysis),
      });

      if (!response.ok) {
        throw new Error('Failed to generate syllabus');
      }

      const data = await response.json();
      setGeneratedSyllabus(data); // Store the generated syllabus
      setIsSyllabusReady(true); // Enable "Next" button when the syllabus is ready
    } catch (error) {
      console.error('Error generating syllabus:', error);
      toast.error('Error generating the syllabus. Please try again.');
    } finally {
      setIsLoading(false);
    }
      
  };

  const handleNextClick = () => {
    if (generatedSyllabus) {
      onNext(generatedSyllabus); // Pass the generated syllabus to the next component
    }
  };


  const processTopics = (inputJson: string) => {
    // Parse the input JSON
    const data = JSON.parse(inputJson);
    
    // Get the language and MainTopics from the nested 'Analysis' object
    const { Language, MainTopics } = data.Analysis;

    
    // Determine the midpoint of the MainTopics array
    const halfIndex = Math.floor(MainTopics.length / 2);
  
    let filteredTopics;
  
    // Check the language and select the appropriate half of the topics
    if (Language === 'Italian') {
      // Take the second half of the array for Italian
      filteredTopics = MainTopics.slice(halfIndex);
    } else {
      // For any other language (assume English), take the first half
      filteredTopics = MainTopics.slice(0, halfIndex);
    }
  
    // Create a new JSON with the filtered topics
    const newJson = {
      ...data,
      Analysis: {
        ...data.Analysis,
        MainTopics: filteredTopics,
      },
    };
  
    return newJson;
  };

  function transformInput(inputString: string, selectedBloomLevels: string[]) {
    try {
      const parsedData = JSON.parse(inputString);
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
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}

      <h2 style={headerStyle}>Contextual information</h2>

      <label style={labelStyle}>
        Pedagogical Framework
        <select value={framework} onChange={handleFrameworkChange} style={selectStyle}>
          <option value="Revised Bloom Taxonomy">Revised Bloom Taxonomy</option>
          {/* Add more frameworks if needed */}
        </select>
      </label>

      <label style={labelStyle}>Select a level</label>
      <div style={levelsContainerStyle}>
        {bloomLevels.map((level) => (
          <div key={level} style={checkboxContainerStyle}>
            <input
              type="checkbox"
              id={`level-${level}`}
              value={level}
              checked={selectedLevels.includes(level)} // Ensure levels are correctly checked
              onChange={() => handleLevelChange(level)}
              style={checkboxStyle}
            />
            <label htmlFor={`level-${level}`} style={levelLabelStyle}>
              {level}
            </label>
          </div>
        ))}
      </div>

      {/* Show the spinner/message when loading */}
      {isLoading && (
        <div style={spinnerStyle}>
          <div className="spinner"></div> {/* This could be a spinner graphic */}
          <p>Generating syllabus, please wait...</p>
        </div>
      )}

      <div style={navigationButtonsStyle}>
        <button style={navButtonStyle} onClick={onBack}>
          ← Back
        </button>
        <button
          onClick={isSyllabusReady ? handleNextClick : handleSubmit} // Generate the syllabus if it's not ready, otherwise move to the next step
          style={isSyllabusReady || !isLoading ? generateButtonStyle : disabledButtonStyle} // Emphasize Generate button when it's ready to be clicked
          disabled={isLoading} // Disable during loading
        >
          {isLoading ? 'Generating syllabus...' : isSyllabusReady ? 'Next Step →' : 'Generate Syllabus'}
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
  maxWidth: '600px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  marginBottom: '20px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '10px',
};

const selectStyle: React.CSSProperties = {
  fontSize: '16px',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
  marginBottom: '20px',
};

const levelsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
};

const checkboxContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const checkboxStyle: React.CSSProperties = {
  marginRight: '10px',
};

const levelLabelStyle: React.CSSProperties = {
  fontSize: '16px',
};

const spinnerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  margin: '20px 0',
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

const generateButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50', // Highlight Generate button with a green color
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add some emphasis with a shadow
};

const disabledButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#ccc', // Disabled button color
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'not-allowed',
};

export default PedagogicalFrame;

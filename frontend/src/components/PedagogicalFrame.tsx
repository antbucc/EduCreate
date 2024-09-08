import React, { useState } from 'react';

interface PedagogicalFrameProps {
  framework: string;
  levels: string[];
  onNext: (framework: string, levels: string[]) => void;
  onBack: () => void;
}

const PedagogicalFrame: React.FC<PedagogicalFrameProps> = ({
  framework: initialFramework,
  levels: initialLevels,
  onNext,
  onBack,
}) => {
  const [framework, setFramework] = useState<string>(initialFramework || 'Revised Bloom Taxonomy');
  const [selectedLevels, setSelectedLevels] = useState<string[]>(initialLevels || []);

  const handleFrameworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFramework(event.target.value);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prevSelectedLevels) =>
      prevSelectedLevels.includes(level)
        ? prevSelectedLevels.filter((l) => l !== level)
        : [...prevSelectedLevels, level]
    );
  };

  const handleSubmit = () => {
    console.log("quanti seleceted: "+selectedLevels.length);
    
    onNext(framework, selectedLevels);
  };

  return (
    <div style={formContainerStyle}>
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
        {['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'].map((level) => (
          <div key={level} style={checkboxContainerStyle}>
            <input
              type="checkbox"
              id={`level-${level}`}
              value={level}
              checked={selectedLevels.includes(level)}
              onChange={() => handleLevelChange(level)}
              style={checkboxStyle}
            />
            <label htmlFor={`level-${level}`} style={levelLabelStyle}>
              {level}
            </label>
          </div>
        ))}
      </div>

      <div style={navigationButtonsStyle}>
        <button style={navButtonStyle} onClick={onBack}>
          ← Back
        </button>
        <button onClick={handleSubmit} style={navButtonStyle}>
          Next Step →
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

export default PedagogicalFrame;

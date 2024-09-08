import React, { useState, useEffect } from 'react';

interface ContextualFrameProps {
  topics: string[];
  selectedTopics: string[];
  classLevel: string;
  onNext: (topics: string[], classLevel: string) => void;
  onBack: () => void;
}

const ContextualFrame: React.FC<ContextualFrameProps> = ({
  topics,
  selectedTopics: initialSelectedTopics,
  classLevel: initialClassLevel,
  onNext,
  onBack,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelectedTopics);
  const [classLevel, setClassLevel] = useState<string>(initialClassLevel);

  const [customTopic, setCustomTopic] = useState<string>('');

  useEffect(() => {
    setSelectedTopics(initialSelectedTopics);
    setClassLevel(initialClassLevel);

  }, [initialSelectedTopics, initialClassLevel]);

  const handleTopicChange = (topic: string) => {
    setSelectedTopics((prevSelectedTopics) =>
      prevSelectedTopics.includes(topic)
        ? prevSelectedTopics.filter((t) => t !== topic)
        : [...prevSelectedTopics, topic]
    );
  };

  const handleClassLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClassLevel(event.target.value);
  };



  const handleAddCustomTopic = () => {
    if (customTopic && !selectedTopics.includes(customTopic)) {
      setSelectedTopics([...selectedTopics, customTopic]);
      setCustomTopic('');
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length > 0 && classLevel) {
      onNext(selectedTopics, classLevel);
    }
  };

  const isFormComplete = selectedTopics.length > 0 && classLevel;

  return (
    <div style={formContainerStyle}>
      <h2 style={headerStyle}>Contextual Information</h2>
      <div style={formContentStyle}>
        <div style={topicsContainerStyle}>
          <label style={topicsLabelStyle}>Select the topic(s)</label>
          <div style={topicsListStyle}>
            {topics.map((topic, index) => (
              <div key={index} style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  id={`topic-${index}`}
                  value={topic}
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                  style={checkboxStyle}
                />
                <label htmlFor={`topic-${index}`} style={topicInputStyle}>
                  {topic}
                </label>
              </div>
            ))}
            {selectedTopics.filter(topic => !topics.includes(topic)).map((topic, index) => (
              <div key={index + topics.length} style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  id={`custom-topic-${index}`}
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleTopicChange(topic)}
                  style={checkboxStyle}
                />
                <label htmlFor={`custom-topic-${index}`} style={topicInputStyle}>
                  {topic}
                </label>
              </div>
            ))}
            <div style={customTopicContainerStyle}>
              <input
                type="text"
                placeholder="Add custom topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                style={customTopicInputStyle}
              />
              <button
                type="button"
                onClick={handleAddCustomTopic}
                style={addButtonStyle}
                disabled={!customTopic.trim()}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div style={contextualFieldsStyle}>
          <label style={fieldLabelStyle}>
            Class Level
            <select value={classLevel} onChange={handleClassLevelChange} style={selectStyle}>
              <option value="">Select class level</option>
              <option value="PreK">Pre-K</option>
              <option value="Primary">Primary School</option>
              <option value="Middle">Middle School</option>
              <option value="High">High School</option>
              <option value="Academic">Academic</option>
              <option value="Professional">Professional</option>
            </select>
          </label>
        </div>
      </div>

      <div style={navigationButtonsStyle}>
        <button style={navButtonStyle} onClick={onBack}>
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          style={{ ...navButtonStyle, backgroundColor: isFormComplete ? '#01A9C2' : '#ccc' }}
          disabled={!isFormComplete}
        >
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
  maxWidth: '800px',
  height: '600px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  marginBottom: '20px',
};

const formContentStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '20px',
  height: 'calc(100% - 60px)',
};

const topicsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
};

const topicsLabelStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '10px',
};

const topicsListStyle: React.CSSProperties = {
  maxHeight: '450px',
  overflowY: 'auto',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
};

const checkboxContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const checkboxStyle: React.CSSProperties = {
  marginRight: '10px',
};

const topicInputStyle: React.CSSProperties = {
  fontSize: '16px',
  flex: 1,
};

const customTopicContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const customTopicInputStyle: React.CSSProperties = {
  fontSize: '16px',
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  borderBottom: '1px solid #ccc',
};

const addButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#01A9C2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
};

const contextualFieldsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '10px',
  height: '100%',
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 500,
};

const selectStyle: React.CSSProperties = {
  fontSize: '16px',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '100%',
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

export default ContextualFrame;

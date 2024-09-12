import React, { useState, useEffect } from 'react';
import infoImage from '../assets/lucide_info.svg';
import analyseIcon from '../assets/pepicons-pop_reload.svg';

interface UploadFrameProps {
  onComplete: (analysis: string, topics: string[], file: File | null, url: string) => void;
  pdfFile: File | null;
  url: string;
}

const UploadFrame: React.FC<UploadFrameProps> = ({ onComplete, pdfFile: initialPdfFile, url: initialUrl }) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading spinner
  const [topics, setTopics] = useState<string[]>([]); // State to hold the topics
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]); // State for selected topics

  useEffect(() => {
    setIsAnalyzable(Boolean(url && validateUrl(url)));
  }, [url]);

  const baseURL = "https://backend-production-60c1.up.railway.app";

  const validateUrl = (url: string) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)' +
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|' +
      'localhost)' +
      '(\\:\\d+)?' +
      '(\\/[-a-zA-Z\\d%_.~+]*)*' +
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
      '(\\#[-a-zA-Z\\d_]*)?$',
      'i'
    );
    return !!urlPattern.test(url);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = event.target.value;
    setUrl(inputUrl);

    if (inputUrl.trim() !== '') {
      if (validateUrl(inputUrl)) {
        setUrlError('');
        setIsAnalyzable(true); // Enable button if URL is valid
      } else {
        setUrlError('Invalid URL format');
        setIsAnalyzable(false);
      }
    } else {
      setIsAnalyzable(false);
    }
  };

  const handleAnalyze = async () => {
    if (!isAnalyzable) return;

    setIsLoading(true); // Start the loading spinner

    try {
      const bodyString = JSON.stringify({ material: url });
      const analyzeUrl = `${baseURL}/analyze-material`;

      const response = await fetch(analyzeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });

      if (response.ok) {
        const result = await response.json();
        const generatedTopics = result.MainTopics.map((topicObj: { Topic: string }) => topicObj.Topic);

        // Set topics and mark all topics as selected by default
        setTopics(generatedTopics);
        setSelectedTopics(generatedTopics); // Select all topics by default
        onComplete(result, generatedTopics, null, url);
      } else {
        console.error('Material analysis failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error analyzing material:', error);
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  const handleTopicChange = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic)); // Unselect if already selected
    } else {
      setSelectedTopics([...selectedTopics, topic]); // Select if not already selected
    }
  };

  return (
    <div style={uploadFrameStyle}>
      <h2 style={headerStyle}>Upload your resources</h2>
      <p style={descriptionStyle}>Resources from URLs can be added</p>

      <div style={uploadSectionStyle}>
        <div style={urlInputContainerStyle}>
          <div style={labelContainerStyle}>
            <label style={labelStyle}>URL</label>
            <img src={infoImage} alt="Info" style={infoIconImageStyle} />
          </div>
          <div style={urlInputAndButtonStyle}>
            <input
              type="text"
              placeholder="Enter URL"
              value={url}
              onChange={handleUrlChange}
              style={{ ...inputStyle, borderColor: urlError ? 'red' : undefined }}
            />
            {urlError && <p style={errorStyle}>{urlError}</p>}
          </div>
        </div>
      </div>

      <button
        style={{
          ...analyseButtonStyle,
          backgroundColor: isAnalyzable ? '#01A9C2' : '#ccc',
          cursor: isAnalyzable ? 'pointer' : 'not-allowed',
        }}
        onClick={handleAnalyze}
        disabled={!isAnalyzable || isLoading} // Disable button when loading
      >
        {isLoading ? 'Topics Extraction...' : 'Analyze the material'}
        {isLoading && (
          <div style={spinnerStyle}></div> // Loading spinner
        )}
        {!isLoading && (
          <img src={analyseIcon} alt="Analyse Icon" style={iconImageStyle} />
        )}
      </button>

      {/* Render the topics with checkboxes */}
      {topics.length > 0 && (
        <div style={topicsContainerStyle}>
          <h3 style={topicsHeaderStyle}>Topics:</h3>
          {topics.map((topic, index) => (
            <div key={index} style={topicCheckboxStyle}>
              <input
                type="checkbox"
                id={`topic-${index}`}
                checked={selectedTopics.includes(topic)} // Ensure topics are checked if included in selectedTopics
                onChange={() => handleTopicChange(topic)} // Allow deselecting
              />
              <label htmlFor={`topic-${index}`}>{topic}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const uploadFrameStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0)',
  maxWidth: '500px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  fontFamily: 'Raleway',
  color: '#1E1E1E',
  marginBottom: '10px',
  width: '100%',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 500,
  fontFamily: 'Raleway, sans-serif',
  opacity: 0.8,
  color: '#1E1E1E',
};

const uploadSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const urlInputContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const urlInputAndButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const labelContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 400,
  fontFamily: 'Raleway',
  color: '#263238',
  opacity: 0.6,
};

const infoIconImageStyle: React.CSSProperties = {
  width: '14px',
  height: '14px',
  cursor: 'default',
};

const inputStyle: React.CSSProperties = {
  fontSize: '16px',
  fontFamily: 'Raleway, sans-serif',
  color: '#263238',
  width: '300px',
  padding: '10px 15px',
  borderRadius: '10px',
  border: '1px solid rgba(38, 50, 56, 0.10)',
  backgroundColor: '#FFF',
  marginBottom: '20px',
};

const analyseButtonStyle: React.CSSProperties = {
  display: 'flex',
  padding: '15px 30px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
  borderRadius: '60px',
  border: '1px solid #1E1E1E',
  backgroundColor: '#FFF',
  color: '#1E1E1E',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  cursor: 'pointer',
  position: 'relative',
};

const iconImageStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
};

const spinnerStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  border: '2px solid #f3f3f3',
  borderTop: '2px solid #01A9C2',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  position: 'absolute',
  right: '10px',
};

const topicsContainerStyle: React.CSSProperties = {
  marginTop: '20px',
};

const topicsHeaderStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  marginBottom: '10px',
};

const topicCheckboxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '10px',
};

export default UploadFrame;

import React, { useState, useEffect } from 'react';
import infoImage from '../assets/lucide_info.svg';
import uploadIconImage from '../assets/solar_download-outline.svg';
import analyseIcon from '../assets/pepicons-pop_reload.svg';

interface UploadFrameProps {
  onComplete: (analysis: string, topics: string[], file: File | null, url: string) => void;
  pdfFile: File | null;
  url: string;
}

const UploadFrame: React.FC<UploadFrameProps> = ({ onComplete, pdfFile: initialPdfFile, url: initialUrl }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(initialPdfFile);
  const [url, setUrl] = useState<string>(initialUrl);
  const [isPdfUploaded, setIsPdfUploaded] = useState<boolean>(false);
  const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [urlError, setUrlError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading spinner

  useEffect(() => {
    // Enable the "Analyze the material" button only if the PDF has been uploaded completely or a valid URL is entered
    setIsAnalyzable(isPdfUploaded || Boolean(url && validateUrl(url)));
  }, [isPdfUploaded, url]);

  //const isProduction = process.env.NODE_ENV === 'production';
//  const baseURL = isProduction ? 'https://backend-production-60c1.up.railway.app' : 'http://localhost:5002';

   const baseURL = "https://backend-production-60c1.up.railway.app";
   console.log("URL BACKEND: "+baseURL);
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

  const handlePDFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
      setIsPdfUploaded(false); // Reset the upload status until the new file is uploaded
    }
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
    } else if (!isPdfUploaded) {
      setIsAnalyzable(false);
    }
  };

  const handlePDFUpload = async () => {
    if (!pdfFile) {
      console.error('No PDF file selected.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', pdfFile);

      const uploadResponse = await fetch(`${baseURL}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        console.log("Upload Result: "+uploadResult);
        setIsPdfUploaded(true);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 3000); // Show popup for 3 seconds
      } else {
        console.error('PDF upload failed:', uploadResponse.statusText);
        setIsPdfUploaded(false);
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setIsPdfUploaded(false);
    }
  };

  const handleAnalyze = async () => {
    if (!isAnalyzable) return;

    setIsLoading(true); // Start the loading spinner

    try {
      let materialUrl = '';

      if (isPdfUploaded && pdfFile) {
        materialUrl = `${baseURL}/local-pdfs/${pdfFile.name}`;
      } else if (url && validateUrl(url)) {
        materialUrl = url;
      }

      const bodyString = JSON.stringify({ material: materialUrl });
      const analyzeUrl = `${baseURL}/analyze-material`;
      console.log("URL DI ANALISI: "+analyzeUrl);
      console.log("BODY: "+bodyString);
      const response = await fetch(analyzeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyString,
      });

      if (response.ok) {
        const result = await response.json();
        const topics = result.MainTopics.map((topicObj: { Topic: string }) => topicObj.Topic);
        onComplete(result,topics, pdfFile, url);
      } else {
        console.error('Material analysis failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error analyzing material:', error);
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  return (
    <div style={uploadFrameStyle}>
      <h2 style={headerStyle}>Upload your resources</h2>
      <p style={descriptionStyle}>Resources from PDF or URLs can be added</p>

      <div style={uploadSectionStyle}>
        <div style={inputContainerStyle}>
          <div style={labelContainerStyle}>
            <label style={labelStyle}>PDF</label>
            <img src={infoImage} alt="Info" style={infoIconImageStyle} />
          </div>
          <div style={uploadButtonContainerStyle}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFChange}
              style={inputStyle}
            />
            <button style={uploadButtonStyle} onClick={handlePDFUpload} disabled={!pdfFile}>
              Upload PDF
              <img src={uploadIconImage} alt="Upload Icon" style={iconImageStyle} />
            </button>
          </div>
        </div>

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

      {isPopupVisible && (
        <div style={popupStyle}>
          PDF uploaded successfully!
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

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
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

const uploadButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const uploadButtonStyle: React.CSSProperties = {
  display: 'flex',
  padding: '15px 30px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '60px',
  border: '1px solid #01A9C2',
  backgroundColor: '#01A9C2',
  color: '#FFFFFF',
  fontSize: '16px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  cursor: 'pointer',
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

const popupStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#01A9C2',
  color: '#FFFFFF',
  padding: '10px 20px',
  borderRadius: '5px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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

export default UploadFrame;

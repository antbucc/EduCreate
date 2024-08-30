import React from 'react';
import infoImage from '../assets/lucide_info.svg';
import uploadIconImage from '../assets/solar_download-outline.svg';
import analyseIcon from '../assets/pepicons-pop_reload.svg';

const UploadFrame: React.FC = () => {
  return (
    <div style={uploadFrameStyle}>
      <h2 style={headerStyle}>Upload your resources</h2>
      <p style={descriptionStyle}>Resources from PDF or URLs can be added</p>

      <div style={uploadSectionStyle}>
        {/* PDF Upload Section */}
        <div style={inputContainerStyle}>
          <div style={labelContainerStyle}>
            <label style={labelStyle}>PDF</label>
            <img src={infoImage} alt="Info" style={infoIconImageStyle} />
          </div>
          <div style={uploadButtonContainerStyle}>
            <button style={uploadButtonStyle}>
              Upload PDF
              <img src={uploadIconImage} alt="Upload Icon" style={iconImageStyle} />
            </button>
          </div>
        </div>

        {/* URL Upload Section */}
        <div style={urlInputContainerStyle}>
          <div style={labelContainerStyle}>
            <label style={labelStyle}>URL</label>
            <img src={infoImage} alt="Info" style={infoIconImageStyle} />
          </div>
          <div style={urlInputAndButtonStyle}>
            <input type="text" placeholder="Enter URL" style={inputStyle} />
            <button style={addButtonStyle}>
              Add URL
              <img src={uploadIconImage} alt="Add Icon" style={iconImageStyle} />
            </button>
          </div>
        </div>
      </div>

      {/* Analyse Button */}
      <button style={analyseButtonStyle}>
        Analyse the material
        <img src={analyseIcon} alt="Analyse Icon" style={iconImageStyle} />
      </button>
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
  width: '300px',  // Adjust the width as needed
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

const addButtonStyle: React.CSSProperties = {
  display: 'flex',
  padding: '10px 20px',
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
};

const iconImageStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
};

export default UploadFrame;

// src/components/Footer.tsx
import React from 'react';
import footerImage from '../assets/footerImage.svg';
const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={leftStyle}>
        <img src={footerImage} alt="Footer Logo" style={imageStyle} />
      </div>
      <div style={rightStyle}>
        <p>&copy; 2024 My React App</p>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: 'white',
  position: 'fixed',
  width: '100%',
  bottom: 0,
};

const leftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const imageStyle: React.CSSProperties = {
  height: '40px',
  marginRight: '10px',
};

export default Footer;

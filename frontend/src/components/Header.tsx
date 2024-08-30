// src/components/Header.tsx
import React from 'react';
import logo from '../assets/logo.svg'; // Adjust the path if your logo is located elsewhere
import userIcon from '../assets/radix-icons_accessibility.svg'; // Import the SVG file

const Header: React.FC = () => {
  return (
    <header style={headerFrameStyle}>
      <div style={leftStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h1 style={titleStyle}>EduCreate</h1>
      </div>
      <div style={rightStyle}>
        <img src={userIcon} alt="User Icon" style={iconStyle} /> {/* Use the SVG icon */}
      </div>
    </header>
  );
};

const headerFrameStyle: React.CSSProperties = {
  display: 'flex',
  width: '1280px',
  padding: '20px 30px',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#FFF', // Background color for the header frame
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Optional: Add some shadow for better visual separation
  margin: '0 auto', // Center the header frame within the parent container
  borderBottom: '10px solid #619593',
};


const leftStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const rightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  height: '40px',
  marginRight: '10px',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '32px',
  fontFamily: 'Raleway, sans-serif',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: 'normal',
  color: '#000',
};

const iconStyle: React.CSSProperties = {
  height: '40px', // Adjust the size of the user icon as needed
  width: '40px', // Adjust the size of the user icon as needed
};

export default Header;

import React from 'react';

interface StepProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isLastStep: boolean; // New prop to control if the line should be displayed or not
}

const Step: React.FC<StepProps> = ({ stepNumber, title, description, isActive, isLastStep }) => {
  return (
    <div style={stepContainerStyle}>
      <div style={leftSideStyle}>
        <div style={stepNumberAndTitleStyle}>
          <h2 style={stepNumberStyle}>Step {stepNumber}</h2>
          <h3 style={titleStyle}>{title}</h3>
        </div>
        <p style={descriptionStyle}>{description}</p>
      </div>
      <div style={rightSideStyle}>
        <svg width="39" height="39">
          <circle
            cx="19.5"
            cy="19.5"
            r="19"
            fill={isActive ? '#00A9C2' : '#FFFFFF'}
            stroke={isActive ? '#00A9C2' : '#BDBDBD'}
            strokeWidth="1"
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontFamily="Raleway, sans-serif"
            fontSize="16px"
            fontWeight="600"
            fill={isActive ? '#FFFFFF' : '#000000'}
          >
            {stepNumber}
          </text>
        </svg>
        {!isLastStep && (
          <svg xmlns="http://www.w3.org/2000/svg" width="1" height="60" viewBox="0 0 1 60" fill="none" style={verticalLineStyle}>
            <path d="M0.5 0V60" stroke="black" strokeOpacity="0.1" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
};

// Styles
const stepContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '20px',
  padding: '10px 0',
  backgroundColor: '#ffffff',
  position: 'relative',
};

const leftSideStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px',
};

const stepNumberAndTitleStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const stepNumberStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontFamily: 'Raleway, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'normal',
  color: '#263238',
  opacity: 0.6,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '18px',
  fontFamily: 'Raleway, sans-serif',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: 'normal',
  color: '#1E1E1E',
};

const descriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontFamily: 'Raleway, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  lineHeight: 'normal',
  color: '#263238',
  opacity: 0.8,
};

const rightSideStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative', // To position the vertical line correctly
};

const verticalLineStyle: React.CSSProperties = {
  position: 'absolute',
  top: '39px',  // Adjust based on the circle's size
  left: '50%',
  transform: 'translateX(-50%)',
};

export default Step;

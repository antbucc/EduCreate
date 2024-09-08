import React from 'react';

interface StepProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isLastStep: boolean;
  onClick: () => void;
}

const Step: React.FC<StepProps> = ({ stepNumber, title, description, isActive, isLastStep, onClick }) => {
  return (
    <div onClick={onClick} style={{ ...stepContainerStyle, cursor: 'pointer', opacity: isActive ? 1 : 0.6 }}>
      <div style={stepNumberStyle(isActive)}>{stepNumber}</div>
      <div style={stepContentStyle}>
        <h3 style={stepTitleStyle}>{title}</h3>
        <p style={stepDescriptionStyle}>{description}</p>
      </div>
      {!isLastStep && <div style={stepConnectorStyle}></div>}
    </div>
  );
};

const stepContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  paddingBottom: '20px',
};

const stepNumberStyle = (isActive: boolean): React.CSSProperties => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: isActive ? '#01A9C2' : '#CCC',
  color: '#FFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
});

const stepContentStyle: React.CSSProperties = {
  marginLeft: '20px',
};

const stepTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '16px',
  fontWeight: 700,
};

const stepDescriptionStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#666',
};

const stepConnectorStyle: React.CSSProperties = {
  position: 'absolute',
  left: '20px',
  bottom: 0,
  width: '2px',
  height: '20px',
  backgroundColor: '#CCC',
};

export default Step;

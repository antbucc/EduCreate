import React from 'react';
import frameImage from '../assets/material-symbols_help.svg'; // Import the first image
import secondImage from '../assets/bro.svg';
import Step from './Step'; // Import the Step component
import UploadFrame from './UploadFrame'; // Import the UploadFrame component

const Frame: React.FC = () => {
  return (
    <div style={outerContainerStyle}>
      <div style={frameStyle}>
        {/* Steps and Images */}
        <img src={frameImage} alt="Decorative" style={firstImageStyle} />
        <img src={secondImage} alt="Second Decorative" style={secondImageStyle} />

        <div style={stepsContainerStyle}>
          <div>
            <Step stepNumber={1} title="Source" description="Select starting resources." isActive={true} isLastStep={false} />
            <Step stepNumber={2} title="Contextual Information" description="Provide information on the didactic context." isActive={false} isLastStep={false} />
            <Step stepNumber={3} title="Learning Objective" description="Identify the learning objectives." isActive={false} isLastStep={false} />
            <Step stepNumber={4} title="Design" description="Create learning activities." isActive={false} isLastStep={false} />
            <Step stepNumber={5} title="Export" description="Save and export." isActive={false} isLastStep={true} />
          </div>
        </div>

      </div>

      {/* UploadFrame on the right */}
      <UploadFrame />
    </div>
  );
};

const outerContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
};

const frameStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '400px', // Adjust width to make room for the UploadFrame
  height: '642px',
  padding: '30px 60px 10px 60px',
  backgroundColor: '#fff',
  position: 'relative', // Needed to position the images absolutely within this frame
};

const firstImageStyle: React.CSSProperties = {
  width: '58px',
  height: '58px',
  position: 'absolute',
  left: '68px',
  bottom: '43px',
};

const secondImageStyle: React.CSSProperties = {
  width: '145px',
  height: '88.128px',
  position: 'absolute',
  left: '24px',
  top: '555.159px',
};

const stepsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '20px',
  flex: 1, // Allows this container to take up available space
};

export default Frame;

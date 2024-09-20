import React, { useState } from 'react';
import frameImage from '../assets/material-symbols_help.svg';
import secondImage from '../assets/bro.svg';
import Step from './Step';
import UploadFrame from './UploadFrame';
import ContextualFrame from './ContextualFrame';
import PedagogicalFrame from './PedagogicalFrame';
import SyllabusPreviewFrame from './SyllabusPreviewFrame';
import CoursePlanFrame from './CoursePlanFrame';



const Frame: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  // State to manage selections
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [extractedTopics, setExtractedTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<string>(''); // Analysis as string
  const [classLevel, setClassLevel] = useState<string>('Academic');
  const [pedagogicalFramework] = useState<string>('Revised Bloom Taxonomy');
  const [selectedLevels] = useState<string[]>([]);
  const [syllabus, setSyllabus] = useState<string>('');
  const [coursePlan, setCoursePlan] = useState<string>('');
  
  // Handle file or URL upload completion
  const handleUploadComplete = (
    analysisData: string, // Pass analysis as a string
    topics: string[],
    file: File | null,
    enteredUrl: string
  ) => {
    setExtractedTopics(topics);
    setPdfFile(file);
    setUrl(enteredUrl);
    setActiveStep(2);

    setAnalysis(analysisData); // Set the analysis as string
  };

  // Handle contextual information completion
  const handleContextualComplete = (topics: string[], level: string) => {
    setSelectedTopics(topics);
    setClassLevel(level);
    setActiveStep(3);
  };

  // Handle pedagogical information completion
  //const handlePedagogicalComplete = (framework: string, levels: string[]) => {
  //  setPedagogicalFramework(framework);
  //  setSelectedLevels(levels);
  //  setActiveStep(4);
  //};


  // Handle final syllabus preview
  const handleSyllabusPreviewComplete = (syllabus: string) => {
    setSyllabus(syllabus);
    setActiveStep(4); // Move to the final step to preview the syllabus
  };

   // Handle final course plan preview
   const handleCoursePlan = (plan: string) => {
    setCoursePlan(plan);
    setActiveStep(5); // Move to the final step to preview the course plan
  };

  const handleStepClick = (step: number) => {
    if (step <= activeStep) {
      setActiveStep(step); // Allow navigation back to previous steps
    }
  };

  return (
    <div style={outerContainerStyle}>
      <div style={frameStyle}>
        <img src={frameImage} alt="Decorative" style={firstImageStyle} />
        <img src={secondImage} alt="Second Decorative" style={secondImageStyle} />

        <div style={stepsContainerStyle}>
          <Step
            stepNumber={1}
            title="Source"
            description="Select starting resources."
            isActive={activeStep === 1}
            isLastStep={false}
            onClick={() => handleStepClick(1)}
          />
          <Step
            stepNumber={2}
            title="Contextual Information"
            description="Provide information on the didactic context."
            isActive={activeStep === 2}
            isLastStep={false}
            onClick={() => handleStepClick(2)}
          />
          <Step
            stepNumber={3}
            title="Pedagogical Information"
            description="Provide pedagogical context."
            isActive={activeStep === 3}
            isLastStep={false}
            onClick={() => handleStepClick(3)}
          />
          <Step
            stepNumber={4}
            title="Syllabus Preview & Export"
            description="Preview and export your syllabus."
            isActive={activeStep === 4}
            isLastStep={true}
            onClick={() => handleStepClick(4)}
          />
           <Step
            stepNumber={5}
            title="Course Plan Generation"
            description="Preview and export your Course Plan."
            isActive={activeStep === 5}
            isLastStep={true}
            onClick={() => handleStepClick(5)}
          />
        </div>
      </div>
      {activeStep === 1 && (
        <UploadFrame
          onComplete={handleUploadComplete}
          pdfFile={pdfFile}
          url={url}
        />
      )}
      {activeStep === 2 && (
        <ContextualFrame
          topics={extractedTopics}
          selectedTopics={selectedTopics}
          classLevel={classLevel}
          onNext={handleContextualComplete}
          onBack={() => setActiveStep(1)}
        />
      )}
      {activeStep === 3 && (
        <PedagogicalFrame
          framework={pedagogicalFramework}
          levels={selectedLevels}
          analysis = {analysis}
          onNext={handleSyllabusPreviewComplete}
          onBack={() => setActiveStep(2)}
        />
      )}
      {activeStep === 4 && (
        <SyllabusPreviewFrame
          syllabus = {syllabus}
          analysis = {analysis}
          onBack={() => setActiveStep(3)}
          onNext={handleCoursePlan}
        />
      )}
       {activeStep === 5&& (
        <CoursePlanFrame
          coursePlan={coursePlan}
          //analysis={analysis}
          onBack={() => setActiveStep(4)} onGenerate={function (plan: string): void {
            throw new Error('Function not implemented.');
          } }       />
      )}
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
  width: '400px',
  height: '642px',
  padding: '30px 60px 10px 60px',
  backgroundColor: '#fff',
  position: 'relative',
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
  flex: 1,
};

export default Frame;

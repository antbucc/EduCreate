import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo1.png';
import { jsPDF } from 'jspdf';

interface CourseTopic {
  Topic: string;
  Description: string;
}

interface SyllabusData {
  CourseTitle: string;
  CourseDescription: string;
  LearningOutcomes: string[];
  CourseGoals: string[];
  CourseTopics: CourseTopic[];
  Prerequisites: string[];
}

interface SyllabusPreviewFrameProps {
  syllabus: string | SyllabusData;
  onBack: () => void;
}

const SyllabusPreviewFrame: React.FC<SyllabusPreviewFrameProps> = ({ syllabus, onBack }) => {
  const [parsedSyllabus, setParsedSyllabus] = useState<SyllabusData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Parse the syllabus string when the component mounts
  useEffect(() => {
    if (typeof syllabus === 'string') {
      try {
        const syllabusObject = JSON.parse(syllabus) as SyllabusData;
        setParsedSyllabus(syllabusObject);
      } catch (error) {
        console.error('Failed to parse syllabus:', error);
      }
    } else {
      setParsedSyllabus(syllabus); // If it's already an object, set it directly
    }
  }, [syllabus]);

  const handleSave = () => {
    toast.success('Field saved successfully!');
    setEditingField(null); // Stop editing
  };

  const handleInputChange = (field: keyof SyllabusData, value: string) => {
    if (parsedSyllabus) {
      setParsedSyllabus({ ...parsedSyllabus, [field]: value });
    }
  };

  const handleArrayChange = (field: keyof SyllabusData, index: number, value: string) => {
    if (parsedSyllabus) {
      const updatedArray = [...(parsedSyllabus[field] as string[])];
      updatedArray[index] = value;
      setParsedSyllabus({ ...parsedSyllabus, [field]: updatedArray });
    }
  };

  const handleTopicChange = (index: number, field: keyof CourseTopic, value: string) => {
    if (parsedSyllabus) {
      const updatedTopics = [...parsedSyllabus.CourseTopics];
      updatedTopics[index] = { ...updatedTopics[index], [field]: value };
      setParsedSyllabus({ ...parsedSyllabus, CourseTopics: updatedTopics });
    }
  };

  // Export syllabus as a styled PDF
  const handleExportSyllabus = () => {
    if (parsedSyllabus) {
      const doc = new jsPDF();

      // Add logo
      const logoUrl = logo; // Replace with actual logo URL or base64
      doc.addImage(logoUrl, 'PNG', 10, 10, 40, 15); // Adjust logo size

      // Add title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16); // Reduced title font size
      doc.setTextColor(40, 44, 52);
      doc.text(parsedSyllabus.CourseTitle, 105, 30, { align: 'center' });

      // Line break
      doc.setLineWidth(0.5);
      doc.setDrawColor(40, 44, 52);
      doc.line(20, 35, 190, 35); // Horizontal line after title

      // Add Course Description
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12); // Reduced section title font size
      doc.text('Course Description:', 20, 45);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10); // Reduced description font size
      doc.text(parsedSyllabus.CourseDescription, 20, 50, { maxWidth: 170 });

      // Add Learning Outcomes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Learning Outcomes:', 20, 70);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      parsedSyllabus.LearningOutcomes.forEach((outcome, index) => {
        doc.text(`${index + 1}. ${outcome}`, 20, 75 + index * 8); // Adjusted spacing for compactness
      });

      // New page for Course Goals and Topics
      doc.addPage();

      // Add Course Goals
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Course Goals:', 20, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      parsedSyllabus.CourseGoals.forEach((goal, index) => {
        doc.text(`${index + 1}. ${goal}`, 20, 25 + index * 8);
      });

      // Add Course Topics
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Course Topics:', 20, 65);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      parsedSyllabus.CourseTopics.forEach((topic, index) => {
        doc.text(`${index + 1}. ${topic.Topic}`, 20, 70 + index * 15);
        doc.text(`Description: ${topic.Description}`, 20, 75 + index * 15, { maxWidth: 170 });
      });

      // Add Prerequisites
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Prerequisites:', 20, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      parsedSyllabus.Prerequisites.forEach((prerequisite, index) => {
        doc.text(`${index + 1}. ${prerequisite}`, 20, 25 + index * 8);
      });

      // Save the PDF
      doc.save('syllabus.pdf');
    }
  };

  const renderEditableField = (field: keyof SyllabusData, label: string, isTextArea: boolean = false) => (
    <div style={fieldContainerStyle}>
      <h3>{label}</h3>
      {editingField === field ? (
        <div>
          {isTextArea ? (
            <textarea
              value={parsedSyllabus ? (parsedSyllabus[field] as string) : ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              style={textareaStyle}
            />
          ) : (
            <input
              type="text"
              value={parsedSyllabus ? (parsedSyllabus[field] as string) : ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              style={inputStyle}
            />
          )}
          <button onClick={handleSave} style={saveButtonStyle}>
            &#x2714; {/* Unicode check mark symbol */}
          </button>
        </div>
      ) : (
        <div>
          <p>{parsedSyllabus ? (parsedSyllabus[field] as string) : ''}</p>
          <button onClick={() => setEditingField(field)} style={editButtonStyle}>
            &#9998; {/* Unicode pencil (edit) symbol */}
          </button>
        </div>
      )}
    </div>
  );

  if (!parsedSyllabus) {
    return <div>Loading...</div>;
  }

  return (
    <div style={mainContainerStyle}>
      <ToastContainer />
      <div style={syllabusContainerStyle}>
        <h2>Syllabus Preview</h2>

        {renderEditableField('CourseTitle', 'Course Title')}
        {renderEditableField('CourseDescription', 'Course Description', true)}

        {/* Learning Outcomes */}
        <div style={sectionContainerStyle}>
          <h3>Learning Outcomes</h3>
          {parsedSyllabus.LearningOutcomes.map((outcome, index) => (
            <div key={index}>
              {editingField === `LearningOutcome-${index}` ? (
                <div>
                  <textarea
                    value={outcome}
                    onChange={(e) => handleArrayChange('LearningOutcomes', index, e.target.value)}
                    style={textareaStyle}
                  />
                  <button onClick={handleSave} style={saveButtonStyle}>
                    &#x2714;
                  </button>
                </div>
              ) : (
                <div>
                  <p>{outcome}</p>
                  <button
                    onClick={() => setEditingField(`LearningOutcome-${index}`)}
                    style={editButtonStyle}
                  >
                    &#9998;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Export and Back Buttons */}
        <div style={buttonContainerStyle}>
          <button style={backButtonStyle} onClick={onBack}>
            ← Back
          </button>
          <button style={exportButtonStyle} onClick={handleExportSyllabus}>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles for the Syllabus Preview
const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

const syllabusContainerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  margin: '0 auto',
  maxHeight: '600px',  // Add max-height for scroll
  overflowY: 'scroll', // Enable vertical scrolling
};

const fieldContainerStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const sectionContainerStyle: React.CSSProperties = {
  marginBottom: '30px',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  marginBottom: '10px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  margin: '10px 0',
  fontSize: '16px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
};

const backButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#01A9C2',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
};

const exportButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer',
};

const editButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  marginRight: '10px',
  backgroundColor: '#f0ad4e',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#5cb85c',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
};

export default SyllabusPreviewFrame;

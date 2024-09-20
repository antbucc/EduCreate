import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
  analysis: string;
  onBack: () => void;
  onNext: (generatedPlan: any) => void;
}

const SyllabusPreviewFrame: React.FC<SyllabusPreviewFrameProps> = ({
  syllabus,
  analysis,
  onBack,
  onNext,
}) => {
  const [parsedSyllabus, setParsedSyllabus] = useState<SyllabusData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numberOfLessons, setNumberOfLessons] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoursePlanReady, setIsCoursePlanReady] = useState(false);
  const [generatedCoursePlan, setGeneratedCoursePlan] = useState<any>(null);

  useEffect(() => {
    if (typeof syllabus === 'string') {
      try {
        const syllabusObject = JSON.parse(syllabus) as SyllabusData;
        setParsedSyllabus(syllabusObject);
      } catch (error) {
        console.error('Failed to parse syllabus:', error);
      }
    } else {
      setParsedSyllabus(syllabus);
    }
  }, [syllabus]);

  const handleSave = () => {
    toast.success('Field saved successfully!');
    setEditingField(null);
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    closeModal();

    try {
      const isProduction = process.env.NODE_ENV === 'production';
      const baseURL = 'https://backend-production-60c1.up.railway.app';
      const url = `${baseURL}/generateCoursePlan`;

      const body = JSON.stringify({
        analysis,
        numberOfLessons,
        lessonDuration: 120,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Failed to generate course plan');
      }

      const data = await response.json();
      setGeneratedCoursePlan(data);
      setIsCoursePlanReady(true);
    } catch (error) {
      console.error('Error generating course plan:', error);
      toast.error('Error generating the course plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextClick = () => {
    if (generatedCoursePlan) {
      onNext(generatedCoursePlan);
    }
  };

// Handle PDF export with enhanced Course Topics style
const handleExportSyllabus = () => {
  if (!parsedSyllabus) return;

  const doc = new jsPDF();
  const lineHeight = 10;
  let yOffset = 20; // Initial vertical offset for text
  const pageHeight = doc.internal.pageSize.height;

  // Function to add new page if necessary
  const checkAndAddPage = () => {
    if (yOffset >= pageHeight - 20) {
      doc.addPage();
      yOffset = 20; // Reset offset for new page
    }
  };

  // Set title for the PDF
  doc.setFontSize(16);
  doc.text('Syllabus', 10, yOffset);
  yOffset += lineHeight + 5;

  // Course Title
  doc.setFontSize(12);
  doc.text(`Course Title: ${parsedSyllabus.CourseTitle}`, 10, yOffset);
  yOffset += lineHeight;
  checkAndAddPage();

  // Course Description
  doc.text('Course Description:', 10, yOffset);
  yOffset += lineHeight;
  doc.setFontSize(10);
  doc.text(parsedSyllabus.CourseDescription, 10, yOffset, { maxWidth: 180 });
  yOffset += lineHeight * (Math.ceil(doc.getTextDimensions(parsedSyllabus.CourseDescription).h / lineHeight)) + 5;
  checkAndAddPage();

  // Learning Outcomes
  doc.setFontSize(12);
  doc.text('Learning Outcomes:', 10, yOffset);
  yOffset += lineHeight;
  parsedSyllabus.LearningOutcomes.forEach((outcome, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${outcome}`, 10, yOffset, { maxWidth: 180 });
    yOffset += lineHeight;
    checkAndAddPage();
  });
  yOffset += 5;
  checkAndAddPage();

  // Course Goals
  doc.setFontSize(12);
  doc.text('Course Goals:', 10, yOffset);
  yOffset += lineHeight;
  parsedSyllabus.CourseGoals.forEach((goal, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${goal}`, 10, yOffset, { maxWidth: 180 });
    yOffset += lineHeight;
    checkAndAddPage();
  });
  yOffset += 5;
  checkAndAddPage();

  // Prerequisites
  doc.setFontSize(12);
  doc.text('Prerequisites:', 10, yOffset);
  yOffset += lineHeight;
  parsedSyllabus.Prerequisites.forEach((prerequisite, index) => {
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${prerequisite}`, 10, yOffset, { maxWidth: 180 });
    yOffset += lineHeight;
    checkAndAddPage();
  });
  yOffset += 5;
  checkAndAddPage();

  // Course Topics
  doc.setFontSize(12);
  doc.text('Course Topics:', 10, yOffset);
  yOffset += lineHeight;
  parsedSyllabus.CourseTopics.forEach((topic, index) => {
    // Bold the Topic Title
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. ${topic.Topic}`, 10, yOffset);
    yOffset += lineHeight;

    // Reset font for Topic Description and indent it
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`- ${topic.Description}`, 15, yOffset, { maxWidth: 180 });
    yOffset += lineHeight + 5; // Add extra spacing after each topic
    checkAndAddPage();
  });

  // Save the PDF
  doc.save('syllabus.pdf');
};


  if (!parsedSyllabus) {
    return <div>Loading...</div>;
  }

  return (
    <div style={mainContainerStyle}>
      <ToastContainer />
      <div style={syllabusContainerStyle}>
        <h2 style={headerStyle}>Syllabus Preview</h2>

        {/* Course Title */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Course Title</h3>
          <div style={inputContainerStyle}>
            {editingField === 'CourseTitle' ? (
              <div style={flexContainerStyle}>
                <input
                  type="text"
                  value={parsedSyllabus ? parsedSyllabus.CourseTitle : ''}
                  onChange={(e) => handleInputChange('CourseTitle', e.target.value)}
                  style={inputStyle}
                />
                <button onClick={handleSave} style={saveButtonStyle}>
                  &#x2714;
                </button>
              </div>
            ) : (
              <div style={flexContainerStyle}>
                <p style={textContentStyle}>{parsedSyllabus ? parsedSyllabus.CourseTitle : ''}</p>
                <button onClick={() => setEditingField('CourseTitle')} style={smallEditButtonStyle}>
                  &#9998;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Course Description */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Course Description</h3>
          <div style={inputContainerStyle}>
            {editingField === 'CourseDescription' ? (
              <div style={flexContainerStyle}>
                <textarea
                  value={parsedSyllabus ? parsedSyllabus.CourseDescription : ''}
                  onChange={(e) => handleInputChange('CourseDescription', e.target.value)}
                  style={scrollableTextareaStyle}
                />
                <button onClick={handleSave} style={saveButtonStyle}>
                  &#x2714;
                </button>
              </div>
            ) : (
              <div style={flexContainerStyle}>
                <p style={textContentStyle}>{parsedSyllabus ? parsedSyllabus.CourseDescription : ''}</p>
                <button onClick={() => setEditingField('CourseDescription')} style={smallEditButtonStyle}>
                  &#9998;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Learning Outcomes</h3>
          {parsedSyllabus.LearningOutcomes.map((outcome, index) => (
            <div key={index} style={inputContainerStyle}>
              {editingField === `LearningOutcome-${index}` ? (
                <div style={flexContainerStyle}>
                  <textarea
                    value={outcome}
                    onChange={(e) => handleArrayChange('LearningOutcomes', index, e.target.value)}
                    style={scrollableTextareaStyle}
                  />
                  <button onClick={handleSave} style={saveButtonStyle}>
                    &#x2714;
                  </button>
                </div>
              ) : (
                <div style={flexContainerStyle}>
                  <p style={textContentStyle}>{outcome}</p>
                  <button onClick={() => setEditingField(`LearningOutcome-${index}`)} style={smallEditButtonStyle}>
                    &#9998;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Course Goals */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Course Goals</h3>
          {parsedSyllabus.CourseGoals.map((goal, index) => (
            <div key={index} style={inputContainerStyle}>
              {editingField === `CourseGoal-${index}` ? (
                <div style={flexContainerStyle}>
                  <textarea
                    value={goal}
                    onChange={(e) => handleArrayChange('CourseGoals', index, e.target.value)}
                    style={scrollableTextareaStyle}
                  />
                  <button onClick={handleSave} style={saveButtonStyle}>
                    &#x2714;
                  </button>
                </div>
              ) : (
                <div style={flexContainerStyle}>
                  <p style={textContentStyle}>{goal}</p>
                  <button onClick={() => setEditingField(`CourseGoal-${index}`)} style={smallEditButtonStyle}>
                    &#9998;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prerequisites */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Prerequisites</h3>
          {parsedSyllabus.Prerequisites.map((prerequisite, index) => (
            <div key={index} style={inputContainerStyle}>
              {editingField === `Prerequisite-${index}` ? (
                <div style={flexContainerStyle}>
                  <textarea
                    value={prerequisite}
                    onChange={(e) => handleArrayChange('Prerequisites', index, e.target.value)}
                    style={scrollableTextareaStyle}
                  />
                  <button onClick={handleSave} style={saveButtonStyle}>
                    &#x2714;
                  </button>
                </div>
              ) : (
                <div style={flexContainerStyle}>
                  <p style={textContentStyle}>{prerequisite}</p>
                  <button onClick={() => setEditingField(`Prerequisite-${index}`)} style={smallEditButtonStyle}>
                    &#9998;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Course Topics */}
        <div style={sectionContainerStyle}>
          <h3 style={sectionHeaderStyle}>Course Topics</h3>
          {parsedSyllabus.CourseTopics.map((topic, index) => (
            <div key={index} style={inputContainerStyle}>
              {editingField === `CourseTopic-${index}` ? (
                <div style={flexContainerStyle}>
                  <textarea
                    value={topic.Topic}
                    onChange={(e) => handleTopicChange(index, 'Topic', e.target.value)}
                    style={scrollableTextareaStyle}
                  />
                  <textarea
                    value={topic.Description}
                    onChange={(e) => handleTopicChange(index, 'Description', e.target.value)}
                    style={scrollableTextareaStyle}
                  />
                  <button onClick={handleSave} style={saveButtonStyle}>
                    &#x2714;
                  </button>
                </div>
              ) : (
                <div style={flexContainerStyle}>
                  <p style={textContentStyle}>{topic.Topic}: {topic.Description}</p>
                  <button onClick={() => setEditingField(`CourseTopic-${index}`)} style={smallEditButtonStyle}>
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
          {isCoursePlanReady && (
            <button onClick={handleNextClick} style={nextButtonStyle}>
              Next: View Course Plan →
            </button>
          )}
          <button onClick={openModal} style={generateButtonStyle} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Course Plan'}
          </button>
          <button style={exportButtonStyle} onClick={handleExportSyllabus}>
            Export PDF
          </button>
        </div>
      </div>


{/* Modal for number of lessons */}
{isModalOpen && (
  <div style={modalOverlayStyle}>
    <div style={smallModalContentStyle}>
      <h3 style={modalTitleStyle}>Course Plan</h3>
      <div style={modalInputWrapperStyle}>
        <label style={modalLabelStyle}>Number of Lessons:</label>
        <input
          type="number"
          value={numberOfLessons}
          onChange={(e) => setNumberOfLessons(Number(e.target.value))}
          min={1}
          style={smallNumberInputStyle} // Reduced size for the input field
        />
      </div>
      <div style={modalButtonContainerStyle}>
        <button style={iconButtonStyle} onClick={handleSubmit}>
          <FaCheck /> {/* Checkmark icon for Submit */}
        </button>
        <button style={iconButtonStyle} onClick={closeModal}>
          <FaTimes /> {/* Times (X) icon for Close */}
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

// Styles for the Syllabus Preview
const mainContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
};

const syllabusContainerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '900px',
  maxHeight: '600px',
  overflowY: 'auto',
};

const sectionContainerStyle: React.CSSProperties = {
  marginBottom: '20px',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const textContentStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  lineHeight: '1.5',
};

const scrollableTextareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  resize: 'none',
  overflowY: 'auto',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: '16px',
};

const flexContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const inputContainerStyle: React.CSSProperties = {
  marginBottom: '10px',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
  borderRadius: '5px',
  cursor: 'pointer',
};

const smallEditButtonStyle: React.CSSProperties = {
  padding: '5px 10px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
  borderRadius: '5px',
  cursor: 'pointer',
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
  borderRadius: '5px',
  cursor: 'pointer',
};

const exportButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const nextButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#FFA500',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const generateButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};


// modal style

const modalTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  marginBottom: '15px',
};

const modalInputWrapperStyle: React.CSSProperties = {
  marginBottom: '10px',
};


const smallNumberInputStyle: React.CSSProperties = {
  width: '60px', // Smaller width for the number input
  padding: '5px',
  fontSize: '14px',
  textAlign: 'center',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const modalLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  marginRight: '10px',
};

const smallModalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
};

const iconButtonStyle: React.CSSProperties = {
  padding: '10px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};


const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center',
};

export default SyllabusPreviewFrame;

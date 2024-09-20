import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation

interface CoursePlan {
  Title: string;
  Topics: string[];
}

interface CoursePlanData {
  Plan: CoursePlan[];
}

interface CoursePlanFrameProps {
  coursePlan: string | CoursePlanData; // Can be a string or an object containing the plan
  onBack: () => void; // Function to go back to the previous step
  onGenerate: (plan: string) => void; // Function to trigger course plan generation
}

const CoursePlanFrame: React.FC<CoursePlanFrameProps> = ({
  coursePlan,
  onBack,
  onGenerate,
}) => {
  const [isGenerating] = useState(false); // Handle generation state
  const [generatedPlan, setGeneratedPlan] = useState<CoursePlanData | null>(null); // Course plan state
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track the row being edited
  const [editedTitle, setEditedTitle] = useState<string>(''); // Track edited title
  const [editedTopics, setEditedTopics] = useState<string>(''); // Track edited topics (comma-separated string)

  useEffect(() => {
    if (typeof coursePlan === 'object') {
      setGeneratedPlan(coursePlan as CoursePlanData); // If coursePlan is an object, set it directly
    } else {
      try {
        const parsedPlan = JSON.parse(coursePlan as string) as CoursePlanData;
        setGeneratedPlan(parsedPlan); // If coursePlan is a string, parse and set it
      } catch (error) {
        console.error('Failed to parse course plan:', error);
      }
    }
  }, [coursePlan]);

  // Handle editing a row
  const handleEditClick = (index: number) => {
    const planItem = generatedPlan?.Plan[index];
    if (planItem) {
      setEditingIndex(index);
      setEditedTitle(planItem.Title);
      setEditedTopics(planItem.Topics.join(', '));
    }
  };

  // Handle saving the edited row
  const handleSaveClick = () => {
    if (generatedPlan && editingIndex !== null) {
      const updatedPlan = [...generatedPlan.Plan];
      updatedPlan[editingIndex] = {
        Title: editedTitle,
        Topics: editedTopics.split(',').map((topic) => topic.trim()),
      };
      setGeneratedPlan({ Plan: updatedPlan });
      setEditingIndex(null); // Clear editing index
    }
  };

  // Handle exporting the course plan as a PDF
  const handleExportPDF = () => {
    if (!generatedPlan) return;

    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Course Plan', 105, 20, { align: 'center' });

    let yOffset = 30; // Starting Y position

    generatedPlan.Plan.forEach((planItem, index) => {
      doc.setFontSize(16);
      doc.text(`Lecture ${index + 1}: ${planItem.Title}`, 20, yOffset);
      yOffset += 10;

      doc.setFont('helvetica', 'normal');
      planItem.Topics.forEach((topic, topicIndex) => {
        doc.text(`- ${topic}`, 30, yOffset);
        yOffset += 8;
      });

      yOffset += 10; // Add some space after each lecture
      if (yOffset > 270) { // Create new page if the content goes beyond the page
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save('course_plan.pdf');
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Course Plan</h2>
      {isGenerating ? (
        <p>Generating course plan, please wait...</p>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Lecture</th>
                <th style={thStyle}>Topics</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generatedPlan && generatedPlan.Plan ? (
                generatedPlan.Plan.map((planItem, index) => (
                  <tr key={index}>
                    {editingIndex === index ? (
                      <>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <input
                            type="text"
                            value={editedTopics}
                            onChange={(e) => setEditedTopics(e.target.value)}
                            style={inputStyle}
                          />
                        </td>
                        <td style={tdStyle}>
                          <button style={saveButtonStyle} onClick={handleSaveClick}>
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={tdStyle}>{planItem.Title}</td>
                        <td style={tdStyle}>{planItem.Topics.join(', ')}</td>
                        <td style={tdStyle}>
                          <button style={editButtonStyle} onClick={() => handleEditClick(index)}>
                          &#9998;
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No course plan available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      <div style={buttonContainerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          ← Back
        </button>
        <button style={exportButtonStyle} onClick={handleExportPDF}>
          Export Course Plan
        </button>
      </div>
    </div>
  );
};

// Styles for the CoursePlanFrame
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
};

const headerStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 600,
  fontFamily: 'Raleway, sans-serif',
  marginBottom: '20px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
};

const thStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tdStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: '14px',
};

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

const editButtonStyle: React.CSSProperties = {
    padding: '5px 10px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #000',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  const saveButtonStyle: React.CSSProperties = {
    padding: '5px 10px',
    backgroundColor: '#fff',
    color: '#000',
    border: '1px solid #000',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  
  

const backButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#01A9C2',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

const exportButtonStyle: React.CSSProperties = {
  padding: '10px 20px',
  backgroundColor: '#FFA500',
  color: '#fff',
  border: 'none',
  borderRadius: '20px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default CoursePlanFrame;

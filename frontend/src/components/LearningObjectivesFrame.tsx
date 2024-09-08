import React, { useState, useEffect } from 'react';

interface LearningObjectivesFrameProps {
    onComplete: (objectives: string[]) => void;
    framework: string;
    context: string;
    levels: string[];
    onBack: () => void;
}

const LearningObjectivesFrame: React.FC<LearningObjectivesFrameProps> = ({
    onComplete,
    framework,
    context,
    levels,
    onBack,
}) => {
    const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
    const [customObjective, setCustomObjective] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchLearningObjectives = async () => {
            setIsLoading(true);
            try {
                const isProduction = process.env.NODE_ENV === 'production';
                const baseURL = isProduction ? 'https://backend-production-60c1.up.railway.app' : 'http://localhost:5002';

                const url = `${baseURL}/getLearningObjectives`;
                const body = { topic: "Plastic Pollution in the Environment", context: "Primary 3", level: 0 };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                if (response.ok) {
                    const result = await response.json();
                    const result1 = cleanAndParseJSON(result);

                    if (result1) {
                        const levelMap: Record<string, string> = {
                            Remember: "Remembering",
                            Understand: "Understanding",
                            Apply: "Applying",
                            Analyse: "Analyzing",
                            Evaluate: "Evaluating",
                            Create: "Creating",
                        };
                    
                        let selectedObjectives: string[] = [];
                    
                        levels.forEach((level) => {
                            const mappedField = levelMap[level]; 
                            if (mappedField) {
                                const objectivesForLevel = retrieveField(result1, mappedField);
                                if (objectivesForLevel && objectivesForLevel.length > 0) {
                                    selectedObjectives = [...selectedObjectives, ...objectivesForLevel];
                                }
                            }
                        });
                    
                        console.log("Filtered Objectives:", selectedObjectives);
                        setLearningObjectives(selectedObjectives);
                    }
            
                } else {
                    console.error('Failed to fetch learning objectives:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching learning objectives:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLearningObjectives();
    }, [context, framework, levels]);

    const handleObjectiveChange = (objective: string) => {
        setSelectedObjectives((prevSelectedObjectives) =>
            prevSelectedObjectives.includes(objective)
                ? prevSelectedObjectives.filter((t) => t !== objective)
                : [...prevSelectedObjectives, objective]
        );
    };

    const handleAddCustomObjective = () => {
        if (customObjective.trim() !== '') {
            // Add the custom objective to both learningObjectives and selectedObjectives
            setLearningObjectives([...learningObjectives, customObjective.trim()]);
            setSelectedObjectives([...selectedObjectives, customObjective.trim()]);
            setCustomObjective('');
        }
    };

    const handleClearAll = () => {
        setSelectedObjectives([]);
    };

    const handleSubmit = () => {
        onComplete(selectedObjectives);
    };

    function cleanAndParseJSON(input: string): Record<string, any> | null {
        try {
            const cleanedString = input
                .replace(/\\"/g, '"')
                .replace(/\\n/g, ' ')
                .replace(/\\t/g, ' ')
                .replace(/\r?\n|\r/g, ' ')
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

            return JSON.parse(cleanedString);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    function retrieveField(jsonObject: Record<string, any>, fieldName: string): any {
        return jsonObject[fieldName] || [];
    }

    return (
        <div style={formContainerStyle}>
            <h2 style={headerStyle}>Learning Objectives</h2>
            {isLoading ? (
                <p>Generating...</p>
            ) : (
                <div style={formContentStyle}>
                    <div style={objectivesContainerStyle}>
                        <label style={objectivesLabelStyle}>Select the learning objectives</label>
                        <div style={objectivesListStyle}>
                            {learningObjectives.map((objective, index) => (
                                <div key={index} style={checkboxContainerStyle}>
                                    <input
                                        type="checkbox"
                                        id={`objective-${index}`}
                                        value={objective}
                                        checked={selectedObjectives.includes(objective)}
                                        onChange={() => handleObjectiveChange(objective)}
                                        style={checkboxStyle}
                                    />
                                    <label htmlFor={`objective-${index}`} style={objectiveInputStyle}>
                                        {objective}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={customObjectiveContainerStyle}>
                        <label style={fieldLabelStyle}>Add Custom Learning Objective</label>
                        <input
                            type="text"
                            value={customObjective}
                            onChange={(e) => setCustomObjective(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={handleAddCustomObjective} style={addButtonStyle}>
                            Add
                        </button>
                    </div>

                    {selectedObjectives.length > 0 && (
                        <button onClick={handleClearAll} style={clearAllButtonStyle}>
                            Clear All
                        </button>
                    )}
                </div>
            )}

            <div style={navigationButtonsStyle}>
                <button style={navButtonStyle} onClick={onBack}>
                    ← Back
                </button>
                <button onClick={handleSubmit} style={navButtonStyle} disabled={selectedObjectives.length === 0}>
                    Next Step →
                </button>
            </div>
        </div>
    );
};

// Styles
const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    height: '700px', 
};

const headerStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 600,
    fontFamily: 'Raleway, sans-serif',
    marginBottom: '20px',
};

const formContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: 'calc(100% - 80px)', 
    overflowY: 'auto',
};

const objectivesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
};

const objectivesLabelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '10px',
};

const objectivesListStyle: React.CSSProperties = {
    maxHeight: '350px', 
    overflowY: 'auto',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
};

const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
};

const checkboxStyle: React.CSSProperties = {
    marginRight: '10px',
};

const objectiveInputStyle: React.CSSProperties = {
    fontSize: '16px',
    flex: 1,
};

const customObjectiveContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
};

const fieldLabelStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
    fontSize: '16px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
};

const addButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#01A9C2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
};

const clearAllButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
};

const navigationButtonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};

const navButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#01A9C2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
};

export default LearningObjectivesFrame;

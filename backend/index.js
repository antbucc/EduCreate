const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Ensure axios is imported
require('dotenv').config();

// Initialize Express app
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API client for the GenAI
const apiClient_SK = axios.create({
  baseURL: 'https://skapi-giunti.polyglot-edu.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const API_KEY = process.env.REACT_APP_API_KEY || '';
const SETUP_MODEL = process.env.REACT_APP_SETUP_MODEL || '';
const SETUP_MODEL_MINI = process.env.REACT_APP_SETUP_MODEL_MINI || '';

// Define the storage path based on the environment
const isProduction = process.env.NODE_ENV === 'production';
const storagePath = isProduction ? process.env.VOLUME_PATH || '/mnt/data/pdfs' : path.join(__dirname, 'local_pdfs');

// Ensure the storage directory exists, and create it if it doesn't
try {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
    console.log(`Directory created at ${storagePath}`);
  }
} catch (error) {
  console.error(`Failed to create directory at ${storagePath}`, error);
  process.exit(1); // Exit the process if the directory can't be created
}

// Set up Multer to save files to the appropriate directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API route to upload a PDF file
app.post('/upload-pdf', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(storagePath, req.file.filename);
  res.status(201).send({ message: 'File uploaded successfully', filePath });
});

// API to analyze the PDF or URL inserted by the educator
app.post('/analyze-material', async (req, res) => {
  const endpoint = '/MaterialAnalyser/analyseMaterial';
  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL,
  };

  let filename = req.body;


  if (filename) {
    // Make the API request to analyze the material
    const body = filename;

    try {
      const response = await apiClient_SK.post(endpoint, body, { headers });
      console.log(`Response from ${apiClient_SK.defaults.baseURL}${endpoint}:`, response.data);
      return res.status(200).json(response.data);
    } catch (error) {
      console.error('Error analyzing material:', error.response ? error.response.data : error.message);
      return res.status(500).send('Error analyzing the material.');
    }
  }

});

// API route to generate learning objectives
app.post('/getLearningObjectives', async (req, res) => {
  const { topic, context, level } = req.body;

  const endpoint = '/LearningObjectiveGenerator/generateLearningObjective';
  const body = { topic: topic, context: context, level: level };
       
 
  const bodyFinal= JSON.stringify(body);
  console.log("BODY FINAL: "+bodyFinal);

  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL,
  };

  // Input validation
  if (!topic || !context || typeof level !== 'number') {
    return res.status(400).json({ error: 'Invalid input data. Please provide a topic, context, and level.' });
  }

  try {
    const response = await apiClient_SK.post(endpoint, bodyFinal, { headers });
    return res.status(200).json(response.data);
 
  
  } catch (error) {
    console.error('Error generating learning objectives:', error.response ? error.response.data : error.message);
    return res.status(500).send('Error generating learning objectives.');
  }
});


// API route to generate learning objectives
app.post('/generateSyllabus', async (req, res) => {
  const bodyReceived= req.body;

  const endpoint = '/SyllabusGenerator/generateSyllabus';
 
  const bodyFinal= JSON.stringify(bodyReceived);


  const headers = {
    'ApiKey': API_KEY,
    'SetupModel': SETUP_MODEL_MINI,
  };


  try {
    const response = await apiClient_SK.post(endpoint, bodyFinal, { headers });
    return res.status(200).json(response.data);
 
  
  } catch (error) {
    console.error('Error generating syllabus:', error.response ? error.response.data : error.message);
    return res.status(500).send('Error generating syllabus.');
  }
});

// Start the Express server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

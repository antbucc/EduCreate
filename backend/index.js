const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize Express app
const app = express();

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

// API route to download a PDF file
app.get('/download-pdf/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(storagePath, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});

// Start the Express server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
require('dotenv').config();  // For environment variables (like MongoDB URI)

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI (replace with your own)
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://bucchiarone:ePYQD19uVQ9ogjwr@beegame.7rsn40p.mongodb.net/EduCreate?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Init gfs
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});

const upload = multer({ storage });

// @route POST /upload-pdf
// @desc Uploads file to DB
app.post('/api/upload-pdf', upload.single('file'), (req, res) => {
  res.status(201).send({
    file: req.file,
    message: 'File uploaded successfully'
  });
});

// @route GET /files
// @desc Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image (if you save images to MongoDB)
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route GET /download/:filename
// @desc Download a PDF or any file stored in MongoDB
app.get('/download/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    const readstream = gfs.createReadStream(file.filename);
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', 'attachment; filename=' + file.filename);
    readstream.pipe(res);
  });
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

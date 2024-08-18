const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const courses = [
  { id: 1, title: 'React Basics', description: 'Learn the basics of React.', image: 'https://via.placeholder.com/300' },
  { id: 2, title: 'Advanced React', description: 'Dive deeper into React.', image: 'https://via.placeholder.com/300' },
];

app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

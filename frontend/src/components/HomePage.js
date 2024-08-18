// src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseList from '../components/CourseList';
import Header from '../components/Header';

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div>
      <Header />
      <CourseList courses={courses} />
    </div>
  );
};

export default HomePage;

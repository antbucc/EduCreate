// src/components/CourseList.js

import React from 'react';
import styled from 'styled-components';
import CourseCard from './CourseCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const CourseList = ({ courses }) => (
  <Grid>
    {courses.map(course => (
      <CourseCard key={course.id} course={course} />
    ))}
  </Grid>
);

export default CourseList;

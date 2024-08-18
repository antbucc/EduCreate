// src/components/CourseCard.js

import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  margin: 20px;
  text-align: left;
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 15px 0;
  color: #333;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
`;

const CourseCard = ({ course }) => (
  <Card>
    <Image src={course.image} alt={course.title} />
    <Title>{course.title}</Title>
    <Description>{course.description}</Description>
  </Card>
);

export default CourseCard;

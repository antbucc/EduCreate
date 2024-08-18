// src/components/Header.js

import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../assets/logo.svg'; // Add a logo SVG in the assets directory

const HeaderContainer = styled.header`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Nav = styled.nav`
  a {
    margin: 0 15px;
    font-size: 1rem;
    color: #333;
  }
`;

const Header = () => (
  <HeaderContainer>
    <Logo width="120" height="40" />
    <Nav>
      <a href="/">Home</a>
      <a href="/courses">Courses</a>
      <a href="/about">About</a>
    </Nav>
  </HeaderContainer>
);

export default Header;

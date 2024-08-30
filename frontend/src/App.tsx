// src/App.tsx
import React from 'react';
import Header from './components/Header';
import Frame from './components/Frame';


const App: React.FC = () => {
  return (
    <div style={appStyle}>
      <Header />
      <Frame />
    </div>
  );
};

const appStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default App;

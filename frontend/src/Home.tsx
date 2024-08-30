import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px', minHeight: '80vh' }}>
        <h2>Welcome to the Home Page</h2>
        <p>This is the main content of the home page.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

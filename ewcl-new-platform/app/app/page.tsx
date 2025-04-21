import React from 'react';
import MolecularViewer from './w'; // Import the MolecularViewer component

const LandingPage = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      {/* Header Section */}
      <header style={{ backgroundColor: '#004d40', color: 'white', padding: '20px 40px' }}>
        <h1 style={{ margin: 0 }}>EWCL Biotech Platform</h1>
        <p style={{ margin: 0 }}>Innovative tools for protein and molecular analysis</p>
      </header>

      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px',
          backgroundColor: '#e0f2f1',
        }}
      >
        <div style={{ maxWidth: '50%' }}>
          <h2>Welcome to the Future of Biotech</h2>
          <p>
            Explore cutting-edge tools for protein analysis, molecular visualization, and more. Our platform is designed
            to empower researchers and scientists with the best tools in the industry.
          </p>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#004d40',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Get Started
          </button>
        </div>
        <div style={{ width: '45%' }}>
          {/* Molecular Viewer Component */}
          <MolecularViewer />
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '40px', backgroundColor: '#ffffff' }}>
        <h2 style={{ textAlign: 'center' }}>Our Features</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '30%' }}>
            <h3>Protein Analysis</h3>
            <p>Analyze protein sequences and structures with precision and ease.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '30%' }}>
            <h3>Molecular Visualization</h3>
            <p>Visualize molecular structures in 3D with our advanced tools.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '30%' }}>
            <h3>Data Integration</h3>
            <p>Integrate and analyze data from multiple sources seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#004d40', color: 'white', padding: '20px', textAlign: 'center' }}>
        <p>&copy; 2025 EWCL Biotech Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ position: 'fixed', left: 0, bottom: 0, width: '100%', backgroundColor: '#007bff', color: 'white', textAlign: 'center', padding: '1rem' }}>
      <div className="container mx-auto">
        <p>&copy; 2024 MyJISc</p>
      </div>
    </footer>
  );
};

export default Footer;
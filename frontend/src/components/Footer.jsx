import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'white',
      borderTop: '1px solid #E2E8F0',
      padding: '2rem',
      textAlign: 'center',
      marginTop: 'auto',
      color: 'var(--text-light)'
    }}>
      <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>TripLedger - Split expenses simply</p>
      <p style={{ fontSize: '0.9em' }}>
        Made by <strong>Akhand</strong> | 
        Email: <a href="mailto:2004akhand@gmail.com">2004akhand@gmail.com</a> | 
        Contact: <a href="https://www.linkedin.com/in/akhand-awasthi-b05b31293">LinkedIn</a>
      </p>
    </footer>
  );
};

export default Footer;

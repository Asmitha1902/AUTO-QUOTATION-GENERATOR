import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer text-center p-3 bg-light mt-5">
      <strong>&copy; {new Date().getFullYear()} Invoice Management System</strong> — All rights reserved.
    </footer>
  );
};

export default Footer;

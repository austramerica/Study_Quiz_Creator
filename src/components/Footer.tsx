import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary-50 border-t border-secondary-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-secondary-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Study Quiz Creator. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-secondary-500 hover:text-primary-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-secondary-500 hover:text-primary-600">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-secondary-500 hover:text-primary-600">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

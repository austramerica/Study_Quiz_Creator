import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-secondary-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">Study Quiz Creator</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-600">
                  Help
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

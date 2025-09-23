import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: 'pet_owner' | 'service_provider' | 'admin';
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated = false, userRole }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="bg-furlink-yellow rounded-full p-2 mr-2">
              <span className="text-furlink-blue font-bold text-lg">🐾</span>
            </div>
            <span className="text-furlink-blue font-bold text-xl">furlink</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/about" 
                  className="text-furlink-blue hover:text-furlink-lightblue transition-colors duration-200"
                >
                  About furlink
                </Link>
                <Link 
                  to="/become-provider" 
                  className="text-furlink-blue hover:text-furlink-lightblue transition-colors duration-200"
                >
                  Become a service provider
                </Link>
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="text-furlink-blue hover:text-furlink-lightblue transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <span className="text-gray-300">or</span>
                  <Link 
                    to="/signup" 
                    className="text-furlink-blue hover:text-furlink-lightblue transition-colors duration-200"
                  >
                    Signup
                  </Link>
                </div>
              </>
            ) : (
              <>
                {userRole === 'pet_owner' && (
                  <Link 
                    to="/become-provider" 
                    className="text-furlink-blue hover:text-furlink-lightblue transition-colors duration-200"
                  >
                    Become a Service Provider
                  </Link>
                )}
                <div className="flex items-center">
                  <button className="bg-furlink-blue text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-furlink-lightblue transition-colors duration-200">
                    👤
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
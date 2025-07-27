import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTrophy } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Get username from user object, fallback to email or 'User'
  const username = user?.email?.split('@')[0] || 'User';

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo on the left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">SkillBench</span>
            </Link>
          </div>
          
          {/* Navigation links in the center */}
          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className={`${location.pathname === '/' ? 'text-primary-600 border-primary-600' : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
              Home
            </Link>
            <Link to="/courses" className={`${location.pathname.startsWith('/courses') ? 'text-primary-600 border-primary-600' : 'text-gray-700 hover:text-gray-900 border-transparent hover:border-gray-300'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
              Courses
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5"
            >
              <FaTrophy className="h-5 w-5" />
              Leaderboard
            </Link>
          </div>
          
          {/* User profile on the right */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 focus:outline-none text-gray-700`}
                >
                  <FaUserCircle className="w-6 h-6" />
                  <span className="block text-sm text-gray-900">
                    {username}
                  </span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaUserCircle className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors`}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/courses') ? 'bg-gray-100 text-primary-600' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}
              >
                Courses
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="px-4 space-y-3">
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 w-full"
                  >
                    <FaUserCircle className="w-8 h-8 text-gray-400" />
                    <div className="ml-3">
                      <span className="text-sm font-medium">
                        {username}
                      </span>
                      {user.email && (
                        <div className="text-sm font-medium text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="mt-3 space-y-1">
                    <style>{`
                      .dropdown-enter {
                        opacity: 0;
                        transform: translateY(-10px);
                      }
                      .dropdown-enter-active {
                        opacity: 1;
                        transform: translateY(0);
                        transition: opacity 150ms ease-out, transform 150ms ease-out;
                      }
                      .dropdown-exit {
                        opacity: 1;
                        transform: translateY(0);
                      }
                      .dropdown-exit-active {
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: opacity 150ms ease-in, transform 150ms ease-in;
                      }
                    `}</style>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2 space-y-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <FaSignInAlt className="mr-2" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-700 bg-primary-100 hover:bg-primary-200"
                  >
                    <FaUserPlus className="mr-2" />
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;

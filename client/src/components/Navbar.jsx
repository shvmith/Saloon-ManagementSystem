import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, LogOut, Settings } from "lucide-react";
import { logout } from "../features/auth/authactions";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout(navigate));
    //setUserMenuAnchor(null);
  };

  const handleSectionClick = (sectionId) => {
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // If we're already on the home page
    if (location.pathname === '/') {
      // Scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with the section hash
      navigate(`/#${sectionId}`);
      
      // After navigation, scroll to the section (needed because React Router doesn't auto-scroll)
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="hover:text-ExtraDarkColor transition duration-300 ease-in-out"
      >
        Home
      </Link>
      <button
        onClick={() => handleSectionClick('services')}
        className="hover:text-ExtraDarkColor transition duration-300 ease-in-out text-left"
      >
        Services
      </button>
      <button
        onClick={() => handleSectionClick('packages')}
        className="hover:text-ExtraDarkColor transition duration-300 ease-in-out text-left"
      >
        Packages
      </button>
      <button
        onClick={() => handleSectionClick('reviews')}
        className="hover:text-ExtraDarkColor transition duration-300 ease-in-out text-left"
      >
        Reviews
      </button>
      <button
        onClick={() => handleSectionClick('contact')}
        className="hover:text-ExtraDarkColor transition duration-300 ease-in-out text-left"
      >
        Contact
      </button>
    </>
  );

  return (
    <nav className="bg-PrimaryColor text-ExtraDarkColor p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-ExtraDarkColor">
          GlowSuite Salon
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLinks />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="bg-SecondaryColor hover:bg-DarkColor text-white p-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
              >
                <User size={24} />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/customer/profile"
                    className="flex items-center px-4 py-2 hover:bg-SecondaryColor hover:text-white transition duration-300"
                  >
                    <Settings size={18} className="mr-2" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition duration-300"
                  >
                    <LogOut size={18} className="mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/signin"
                className="bg-SecondaryColor hover:bg-DarkColor text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-DarkColor hover:bg-ExtraDarkColor text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {isAuthenticated ? (
            <button
              onClick={toggleProfileDropdown}
              className="mr-4 bg-SecondaryColor hover:bg-DarkColor text-white p-2 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
            >
              <User size={24} />
            </button>
          ) : null}

          <button className="text-ExtraDarkColor" onClick={toggleMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-DarkColor mt-4 rounded-lg p-4 shadow-lg animate-slide-down">
          <div className="flex flex-col space-y-4">
            <NavLinks />

            {isAuthenticated ? (
              <>
                <Link
                  to="/customer/profile"
                  className="flex items-center text-white hover:text-SecondaryColor transition duration-300"
                >
                  <Settings size={18} className="mr-2" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-white hover:text-red-500 transition duration-300"
                >
                  <LogOut size={18} className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link
                  to="/signin"
                  className="bg-SecondaryColor hover:bg-ExtraDarkColor text-white px-4 py-2 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-ExtraDarkColor hover:bg-DarkColor text-white px-4 py-2 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Dropdown for Mobile */}
      {isProfileDropdownOpen && !isMenuOpen && isAuthenticated && (
        <div className="md:hidden bg-DarkColor mt-4 rounded-lg p-4 shadow-lg animate-slide-down">
          <div className="flex flex-col space-y-4">
            <Link
              to="/customer/profile"
              className="flex items-center text-white hover:text-SecondaryColor transition duration-300"
            >
              <Settings size={18} className="mr-2" /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-red-500 transition duration-300"
            >
              <LogOut size={18} className="mr-2" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

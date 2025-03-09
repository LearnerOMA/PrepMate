import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

// Nav links configuration for easier maintenance
const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/chatbot', label: 'Chatbot' },
  { to: '/question-generator', label: 'Questions' },
  { to: '/quiz-generator', label: 'Quiz' },
  { to: '/news-aggregator', label: 'News' }
];

const Navbar = ({ sidebarState, userName = 'U', appName = 'AppName', onProfileClick }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarClass, setNavbarClass] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  // Update navbar class based on sidebar state - memoized with useCallback
  const updateNavbarClass = useCallback(() => {
    if (window.innerWidth <= 768) {
      setNavbarClass('full-width');
    } else if (sidebarState === 'collapsed') {
      setNavbarClass('with-collapsed-sidebar');
    } else if (sidebarState === 'hidden') {
      setNavbarClass('full-width');
    } else {
      setNavbarClass('');
    }
  }, [sidebarState]);
  
  // Apply the updateNavbarClass function when component mounts or sidebarState changes
  useEffect(() => {
    updateNavbarClass();
  }, [sidebarState, updateNavbarClass]);
  
  // Listen for window resize events
  useEffect(() => {
    window.addEventListener('resize', updateNavbarClass);
    return () => window.removeEventListener('resize', updateNavbarClass);
  }, [updateNavbarClass]);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.navbar-links') && !event.target.closest('.mobile-menu-button')) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);
  
  return (
    <nav className={`navbar ${navbarClass} ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="icon"></span>
            <span></span>
          </Link>
        </div>
        
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <Link 
            key={link.to}
            to={link.to} 
            className={location.pathname === link.to ? 'active' : ''}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
      
      <div className="navbar-profile">
        <button 
          className="profile-button" 
          onClick={handleProfileClick}
          aria-label="User profile"
        >
          <span className="avatar">{userName.charAt(0).toUpperCase()}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
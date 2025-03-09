import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarContext } from '../App';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { sidebarState, setSidebarState } = useContext(SidebarContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Determine if sidebar is collapsed
  const isCollapsed = sidebarState === 'collapsed';
  
  // Close mobile sidebar when location changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);
  
  // Close mobile sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const mainMenuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/chatbot', label: 'Chatbot', icon: '💬' },
    { path: '/question-generator', label: 'Questions', icon: '❓' },
    { path: '/quiz-generator', label: 'Quiz', icon: '📝' },
    { path: '/news-aggregator', label: 'News', icon: '📰' },
  ];
  
  const supportMenuItems = [
    { path: '/resources', label: 'Resources', icon: '📚' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/help', label: 'Help & Support', icon: '🔍' },
  ];

  const toggleSidebar = () => {
    setSidebarState(isCollapsed ? 'expanded' : 'collapsed');
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)}
      ></div>
      
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="toggle-sidebar" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </div>
        
        <div className="sidebar-header">
          <div className="logo-icon">🎓</div>
          <h3>EduHub</h3>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-section">
            <div className="menu-section-title">Main Menu</div>
            {mainMenuItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {!isCollapsed && location.pathname === item.path && <span className="active-indicator"></span>}
              </Link>
            ))}
          </div>
          
          <div className="menu-section">
            <div className="menu-section-title">Support & Tools</div>
            {supportMenuItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {!isCollapsed && location.pathname === item.path && <span className="active-indicator"></span>}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <span>U</span>
            </div>
            <div className="user-info">
              <h4>User Name</h4>
              <p>Student Premium</p>
            </div>
          </div>
          
          <div className="sidebar-status">
            <div className="status-indicator online"></div>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
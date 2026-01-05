import React from 'react';
import { BookOpen, Bell, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Header.css';

export function Header() {
  const { state, dispatch } = useApp();
  
  const navItems = [
    { id: 'references', icon: BookOpen, label: 'References' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ] as const;
  
  return (
    <header className="header">
      <div className="header-inner">
        <button 
          className="header-brand"
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'home' })}
        >
          <div className="header-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8L12 12L6 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 8L12 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">XRPL Governance Companion</h1>
          </div>
        </button>
        
        <nav className="header-nav">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`header-nav-btn ${state.activeView === id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_VIEW', view: id as typeof state.activeView })}
              aria-label={label}
              title={label}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span className="header-nav-label">{label}</span>
            </button>
          ))}
          <button 
            className="header-avatar"
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'settings' })}
            aria-label="Settings"
          >
            <User size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}

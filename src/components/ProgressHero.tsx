import React from 'react';
import { Lock, Info, HardDrive, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ProgressHero.css';

export function ProgressHero() {
  const { state } = useApp();
  
  // Calculate aggregate validator support
  const totalValidators = 34;
  const currentSupport = 27;
  const needed = totalValidators - currentSupport;
  const progressPercent = Math.round((currentSupport / totalValidators) * 100);
  
  const reassuranceItems = [
    { icon: Lock, text: 'Read-only' },
    { icon: Info, text: 'Informational only' },
    { icon: HardDrive, text: 'Try 3rd or local night' },
    { icon: Folder, text: 'Exports open local' }
  ];
  
  return (
    <section className="progress-hero">
      <div className="progress-hero-content">
        <h2 className="progress-title">Amendments in progress</h2>
        
        <div className="progress-stats">
          <span className="progress-current">{currentSupport}</span>
          <span className="progress-of">of {totalValidators} validators ready</span>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="progress-bar-glow" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        
        <p className="progress-needed">{needed} more needed to activate</p>
        
        <div className="reassurance-card glass-card">
          <div className="reassurance-grid">
            {reassuranceItems.map(({ icon: Icon, text }, index) => (
              <div key={index} className="reassurance-item">
                <Icon size={16} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

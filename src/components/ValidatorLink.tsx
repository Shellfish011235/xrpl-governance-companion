import React from 'react';
import { Key, ChevronRight, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ValidatorLink.css';

export function ValidatorLink() {
  const { state, dispatch } = useApp();
  
  const hasValidatorKey = !!state.preferences.validatorContext.publicKey;
  const votedCount = state.validatorVotes.length;
  const pendingCount = state.liveAmendments.filter(a => a.supported && !a.enabled).length;
  
  const handleClick = () => {
    dispatch({ type: 'SET_VIEW', view: 'validator' });
  };
  
  return (
    <button className="validator-link glass-card" onClick={handleClick}>
      <div className="vl-icon">
        <Key size={24} />
      </div>
      <div className="vl-content">
        <h3 className="vl-title">Validator Context</h3>
        <p className="vl-description">
          {hasValidatorKey 
            ? `${votedCount} voted · ${Math.max(0, pendingCount - votedCount)} awaiting your vote`
            : 'Enter your validator key to track your governance activity'
          }
        </p>
      </div>
      <div className="vl-badges">
        <span className="vl-badge">
          <Shield size={12} />
          Local only
        </span>
        <ChevronRight size={20} className="vl-arrow" />
      </div>
    </button>
  );
}

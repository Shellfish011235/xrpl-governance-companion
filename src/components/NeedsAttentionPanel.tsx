import React, { useState } from 'react';
import { Rocket, Check, Info, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './NeedsAttentionPanel.css';

export function NeedsAttentionPanel() {
  const { state, dispatch, fixOnlyCount, completedCount } = useApp();
  const [showFixList, setShowFixList] = useState(false);
  
  const totalAmendments = state.amendments.length;
  const fixOnlyAmendments = state.amendments
    .filter(a => a.tier === 'A' && a.performanceImpact === 'Low')
    .sort((a, b) => b.waitingDays - a.waitingDays); // Sort by oldest first
  
  const oldestAmendment = fixOnlyAmendments[0];
  const oldestWaitingDays = oldestAmendment?.waitingDays || 0;
  
  const handleViewAmendment = (id: string) => {
    dispatch({ type: 'SELECT_AMENDMENT', id });
  };
  
  const toggleFixList = () => {
    setShowFixList(!showFixList);
  };
  
  return (
    <section className="needs-attention-panel">
      <div className="attention-card glass-card">
        <h3 className="attention-title">What needs attention</h3>
        
        <div className="attention-items">
          <div className="attention-item">
            <Rocket size={16} className="attention-icon attention-icon--blue" />
            <span>
              <strong>{fixOnlyCount}</strong> fix-only amendment{fixOnlyCount !== 1 ? 's' : ''} waiting for review
            </span>
          </div>
          
          {oldestAmendment && (
            <div className="attention-item attention-item--clickable" onClick={() => handleViewAmendment(oldestAmendment.id)}>
              <Clock size={16} className="attention-icon attention-icon--amber" />
              <span>
                <strong>{oldestAmendment.name}</strong> has been waiting {oldestWaitingDays} days
              </span>
              <ExternalLink size={12} className="attention-link-icon" />
            </div>
          )}
          
          <div className="attention-item">
            <Info size={16} className="attention-icon attention-icon--cyan" />
            <span>
              You've reviewed <strong>{completedCount}</strong> of <strong>{totalAmendments}</strong> amendments
            </span>
          </div>
        </div>
        
        {fixOnlyCount > 0 && (
          <div className="fix-list-section">
            <button className="attention-cta" onClick={toggleFixList}>
              {showFixList ? 'Hide' : 'Review'} safest fixes ({fixOnlyCount})
              {showFixList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showFixList && (
              <div className="fix-list">
                {fixOnlyAmendments.map((amendment) => (
                  <button
                    key={amendment.id}
                    className="fix-list-item"
                    onClick={() => handleViewAmendment(amendment.id)}
                  >
                    <div className="fix-item-info">
                      <span className="fix-item-name">{amendment.name}</span>
                      <span className="fix-item-meta">
                        Tier A • Low impact • Waiting {amendment.waitingDays} days
                      </span>
                    </div>
                    <ExternalLink size={14} className="fix-item-arrow" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

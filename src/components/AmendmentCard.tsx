import React from 'react';
import { Zap, ChevronRight, X, Vote, CheckCircle2 } from 'lucide-react';
import { Amendment } from '../types';
import { useApp } from '../context/AppContext';
import './AmendmentCard.css';

interface AmendmentCardProps {
  amendment: Amendment;
}

export function AmendmentCard({ amendment }: AmendmentCardProps) {
  const { state, dispatch, isCompleted, hasVoted: checkHasVoted } = useApp();
  
  const completed = isCompleted(amendment.id);
  const hasValidatorKey = !!state.preferences.validatorContext.publicKey;
  const voted = hasValidatorKey && checkHasVoted(amendment.id);
  
  const handleViewBrief = () => {
    dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id });
  };
  
  const handleMarkCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (completed) {
      dispatch({ type: 'UNDO_COMPLETED', amendmentId: amendment.id });
    } else {
      dispatch({ type: 'MARK_COMPLETED', amendmentId: amendment.id });
    }
  };
  
  const getTierColor = () => {
    switch (amendment.tier) {
      case 'A': return 'tier-a';
      case 'B': return 'tier-b';
      case 'C': return 'tier-c';
      default: return '';
    }
  };
  
  const getTypeLabel = () => {
    if (amendment.tier === 'A' && amendment.performanceImpact === 'Low') {
      return { label: 'Fix-only', color: 'fix-only' };
    }
    if (amendment.tag === 'new') {
      return { label: 'New feature', color: 'new-feature' };
    }
    return null;
  };
  
  const typeLabel = getTypeLabel();
  
  return (
    <article 
      className={`amendment-card glass-card ${completed ? 'completed' : ''} ${voted ? 'voted' : ''}`}
      onClick={handleViewBrief}
    >
      {voted && (
        <div className="voted-indicator">
          <CheckCircle2 size={14} />
          <span>You voted</span>
        </div>
      )}
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{amendment.name}</h3>
          <div className="card-badges">
            <span className={`tier-badge ${getTierColor()}`}>
              Tier {amendment.tier}
            </span>
            {typeLabel && (
              <span className={`type-badge ${typeLabel.color}`}>
                {typeLabel.label}
                {typeLabel.color === 'new-feature' && <Zap size={12} />}
              </span>
            )}
            {hasValidatorKey && !voted && (
              <span className="vote-status-badge not-voted">
                <Vote size={12} />
                Not voted
              </span>
            )}
          </div>
        </div>
        
        <p className="card-summary">{amendment.summary}</p>
        
        <div className="card-footer">
          <div className="card-meta">
            <span className="perf-badge">
              <Zap size={12} />
              Perf: {amendment.performanceImpact}
            </span>
          </div>
          
          <div className="card-actions">
            <button className="action-btn primary" onClick={handleViewBrief}>
              View brief
            </button>
            <button 
              className={`action-btn secondary ${completed ? 'completed' : ''}`}
              onClick={handleMarkCompleted}
            >
              Mark completed
              {completed && <X size={14} />}
            </button>
          </div>
        </div>
      </div>
      
      <ChevronRight size={20} className="card-arrow" />
    </article>
  );
}

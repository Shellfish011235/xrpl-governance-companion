import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './WeeklyDigest.css';

export function WeeklyDigest() {
  const { state, dispatch, isCompleted, fixOnlyCount, nearThresholdCount, completedCount } = useApp();
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  // Get amendments that changed (new or updated)
  const changedAmendments = state.amendments.filter(a => a.tag === 'new' || a.tag === 'updated');
  
  // Get amendments close to threshold
  const closeToThreshold = state.amendments.filter(
    a => a.validatorSupport.required - a.validatorSupport.current <= 3
  );
  
  // Get completed this week (simulated - in real app would filter by date)
  const recentlyCompleted = state.preferences.completedAmendments.slice(-3);
  
  // Get safe fix-only amendments not yet completed
  const safestNext = state.amendments
    .filter(a => a.tier === 'A' && a.performanceImpact === 'Low' && !isCompleted(a.id))
    .slice(0, 3);
  
  return (
    <div className="weekly-digest">
      <div className="digest-inner">
        <header className="digest-header">
          <button className="digest-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="digest-title-group">
            <h1 className="digest-title">Weekly Digest</h1>
            <p className="digest-date">
              <Calendar size={14} />
              Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </header>
        
        {/* What Changed */}
        <section className="digest-section">
          <div className="section-header">
            <RefreshCw size={18} className="section-icon" />
            <h2 className="section-title">What changed</h2>
          </div>
          {changedAmendments.length > 0 ? (
            <div className="digest-list">
              {changedAmendments.map(amendment => (
                <button 
                  key={amendment.id}
                  className="digest-item"
                  onClick={() => dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id })}
                >
                  <span className={`digest-tag digest-tag--${amendment.tag}`}>
                    {amendment.tag === 'new' ? <Sparkles size={12} /> : <RefreshCw size={12} />}
                    {amendment.tag === 'new' ? 'New' : 'Updated'}
                  </span>
                  <span className="digest-item-name">{amendment.name}</span>
                  <ArrowRight size={14} className="digest-arrow" />
                </button>
              ))}
            </div>
          ) : (
            <p className="digest-empty">No changes this week.</p>
          )}
        </section>
        
        {/* What's Close */}
        <section className="digest-section">
          <div className="section-header">
            <TrendingUp size={18} className="section-icon section-icon--indigo" />
            <h2 className="section-title">What's close</h2>
          </div>
          {closeToThreshold.length > 0 ? (
            <div className="digest-list">
              {closeToThreshold.map(amendment => (
                <button 
                  key={amendment.id}
                  className="digest-item"
                  onClick={() => dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id })}
                >
                  <span className="digest-progress">
                    {amendment.validatorSupport.current}/{amendment.validatorSupport.required}
                  </span>
                  <span className="digest-item-name">{amendment.name}</span>
                  <ArrowRight size={14} className="digest-arrow" />
                </button>
              ))}
            </div>
          ) : (
            <p className="digest-empty">No amendments near threshold.</p>
          )}
        </section>
        
        {/* What You Completed */}
        <section className="digest-section">
          <div className="section-header">
            <Check size={18} className="section-icon section-icon--green" />
            <h2 className="section-title">What you completed</h2>
          </div>
          {recentlyCompleted.length > 0 ? (
            <div className="digest-list">
              {recentlyCompleted.map(record => {
                const amendment = state.amendments.find(a => a.id === record.amendmentId);
                if (!amendment) return null;
                return (
                  <div key={record.amendmentId} className="digest-item digest-item--completed">
                    <Check size={14} className="completed-icon" />
                    <span className="digest-item-name">{amendment.name}</span>
                    <span className="digest-date-completed">
                      {new Date(record.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="digest-empty">No completions recorded yet.</p>
          )}
        </section>
        
        {/* What's Safe Next */}
        <section className="digest-section">
          <div className="section-header">
            <ArrowRight size={18} className="section-icon section-icon--amber" />
            <h2 className="section-title">What's safe next</h2>
          </div>
          <p className="section-helper">Fix-only amendments with low performance impact.</p>
          {safestNext.length > 0 ? (
            <div className="digest-list">
              {safestNext.map(amendment => (
                <button 
                  key={amendment.id}
                  className="digest-item"
                  onClick={() => dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id })}
                >
                  <span className="digest-tier">Tier {amendment.tier}</span>
                  <span className="digest-item-name">{amendment.name}</span>
                  <span className="digest-review-time">~{amendment.estimatedReviewMinutes}m</span>
                  <ArrowRight size={14} className="digest-arrow" />
                </button>
              ))}
            </div>
          ) : (
            <p className="digest-empty">All safe amendments completed!</p>
          )}
        </section>
        
        {/* Summary Stats */}
        <section className="digest-summary">
          <div className="summary-stat">
            <span className="summary-value">{completedCount}</span>
            <span className="summary-label">Completed</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{state.amendments.length - completedCount}</span>
            <span className="summary-label">Remaining</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{fixOnlyCount}</span>
            <span className="summary-label">Fix-only waiting</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{nearThresholdCount}</span>
            <span className="summary-label">Near threshold</span>
          </div>
        </section>
      </div>
    </div>
  );
}

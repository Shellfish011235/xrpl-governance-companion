import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Zap, 
  ExternalLink,
  Check,
  RotateCcw,
  Info,
  Sparkles,
  RefreshCw,
  MinusCircle,
  Moon,
  Github,
  FileText,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AmendmentBrief.css';

export function AmendmentBrief() {
  const { state, dispatch, getAmendment, isCompleted } = useApp();
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  const amendment = state.selectedAmendmentId 
    ? getAmendment(state.selectedAmendmentId) 
    : null;
  
  if (!amendment) {
    return null;
  }
  
  const completed = isCompleted(amendment.id);
  const completionRecord = state.preferences.completedAmendments.find(
    c => c.amendmentId === amendment.id
  );
  
  const handleBack = () => {
    dispatch({ type: 'SELECT_AMENDMENT', id: undefined });
  };
  
  const handleMarkCompleted = () => {
    dispatch({ 
      type: 'MARK_COMPLETED', 
      amendmentId: amendment.id, 
      note: note.trim() || undefined 
    });
    setShowNoteInput(false);
    setNote('');
  };
  
  const handleUndo = () => {
    dispatch({ type: 'UNDO_COMPLETED', amendmentId: amendment.id });
  };
  
  const getTagIcon = () => {
    switch (amendment.tag) {
      case 'new': return <Sparkles size={14} />;
      case 'updated': return <RefreshCw size={14} />;
      case 'no_change': return <MinusCircle size={14} />;
      case 'safe_to_ignore': return <Moon size={14} />;
      default: return null;
    }
  };
  
  const getTagLabel = () => {
    switch (amendment.tag) {
      case 'new': return 'New';
      case 'updated': return 'Updated';
      case 'no_change': return 'No change';
      case 'safe_to_ignore': return 'Safe to ignore (for now)';
      default: return '';
    }
  };
  
  const getReferenceIcon = (type: string) => {
    switch (type) {
      case 'github': return <Github size={14} />;
      case 'documentation': return <FileText size={14} />;
      case 'discussion': return <MessageSquare size={14} />;
      case 'analysis': return <BarChart3 size={14} />;
      default: return <ExternalLink size={14} />;
    }
  };
  
  return (
    <div className="amendment-brief">
      <div className="amendment-brief-inner">
        <header className="brief-header">
          <button className="brief-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back to list</span>
          </button>
          
          <div className="brief-meta">
            {amendment.tag && (
              <span className={`brief-tag brief-tag--${amendment.tag}`}>
                {getTagIcon()}
                {getTagLabel()}
              </span>
            )}
            <span className="brief-tier">Tier {amendment.tier}</span>
          </div>
        </header>
        
        <div className="brief-title-section">
          <h1 className="brief-title">{amendment.name}</h1>
          <p className="brief-summary">{amendment.summary}</p>
          
          <div className="brief-quick-stats">
            <div className="quick-stat">
              <Clock size={16} />
              <span>Waiting {amendment.waitingDays} days</span>
            </div>
            <div className="quick-stat">
              <Users size={16} />
              <span>{amendment.validatorSupport.current} / {amendment.validatorSupport.required} validators</span>
            </div>
            <div className="quick-stat">
              <Clock size={16} />
              <span>~{amendment.estimatedReviewMinutes} min review</span>
            </div>
          </div>
        </div>
        
        <div className="brief-content">
          {/* Plain-English Explanation */}
          <section className="brief-section">
            <h2 className="brief-section-title">Plain-English explanation</h2>
            <p className="brief-text">{amendment.plainEnglishExplanation}</p>
          </section>
          
          {/* Who This Helps */}
          <section className="brief-section">
            <h2 className="brief-section-title">
              <Users size={18} />
              Who this helps
              <span className="info-badge">informational</span>
            </h2>
            <div className="benefit-pills">
              {amendment.whoThisHelps.categories.map(category => (
                <span key={category} className="benefit-pill">{category}</span>
              ))}
            </div>
            <p className="brief-text">{amendment.whoThisHelps.explanation}</p>
            {amendment.whoThisHelps.examples && amendment.whoThisHelps.examples.length > 0 && (
              <div className="examples">
                <span className="examples-label">Examples:</span>
                {amendment.whoThisHelps.examples.map((example, i) => (
                  <span key={i} className="example-item">{example}</span>
                ))}
              </div>
            )}
            <p className="brief-disclaimer">
              <Info size={12} />
              Examples are illustrative, not endorsements.
            </p>
          </section>
          
          {/* Ledger Impact */}
          <section className="brief-section">
            <h2 className="brief-section-title">
              <Zap size={18} />
              Ledger impact
              <span className="info-badge">informational</span>
            </h2>
            <div className="impact-grid">
              <div className="impact-item">
                <span className="impact-label">Estimated impact</span>
                <span className={`impact-value impact-value--${amendment.ledgerImpact.estimatedImpact.toLowerCase()}`}>
                  {amendment.ledgerImpact.estimatedImpact}
                </span>
              </div>
              <div className="impact-item">
                <span className="impact-label">Confidence</span>
                <span className="impact-value">{amendment.ledgerImpact.confidence}</span>
              </div>
            </div>
            <div className="affected-areas">
              <span className="affected-label">Affected areas:</span>
              {amendment.ledgerImpact.affectedAreas.map(area => (
                <span key={area} className="affected-pill">{area}</span>
              ))}
            </div>
            <p className="brief-text">{amendment.ledgerImpact.rationale}</p>
            {amendment.ledgerImpact.evidenceLinks && amendment.ledgerImpact.evidenceLinks.length > 0 && (
              <div className="evidence-links">
                {amendment.ledgerImpact.evidenceLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="evidence-link"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </section>
          
          {/* What Changed */}
          {amendment.whatChanged && (
            <section className="brief-section">
              <h2 className="brief-section-title">What changed since last review</h2>
              <p className="brief-text">{amendment.whatChanged}</p>
            </section>
          )}
          
          {/* References */}
          <section className="brief-section">
            <h2 className="brief-section-title">References & links</h2>
            <div className="references-list">
              {amendment.references.map((ref, i) => (
                <a 
                  key={i}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reference-link"
                >
                  {getReferenceIcon(ref.type)}
                  <span>{ref.label}</span>
                  <ExternalLink size={12} className="external-icon" />
                </a>
              ))}
            </div>
          </section>
        </div>
        
        {/* Completion Actions */}
        <footer className="brief-footer">
          {completed ? (
            <div className="completion-status">
              <div className="completion-info">
                <Check size={20} className="completion-icon" />
                <div className="completion-details">
                  <span className="completion-label">Completed</span>
                  {completionRecord && (
                    <span className="completion-date">
                      {new Date(completionRecord.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  {completionRecord?.note && (
                    <span className="completion-note">"{completionRecord.note}"</span>
                  )}
                </div>
              </div>
              <button className="brief-action brief-action--undo" onClick={handleUndo}>
                <RotateCcw size={18} />
                <span>Undo</span>
              </button>
            </div>
          ) : showNoteInput ? (
            <div className="completion-form">
              <input
                type="text"
                placeholder="Optional note (e.g., 'Reviewed with team')"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={100}
                className="note-input"
                autoFocus
              />
              <div className="completion-actions">
                <button 
                  className="brief-action brief-action--cancel"
                  onClick={() => setShowNoteInput(false)}
                >
                  Cancel
                </button>
                <button 
                  className="brief-action brief-action--confirm"
                  onClick={handleMarkCompleted}
                >
                  <Check size={18} />
                  <span>Mark completed</span>
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="brief-action brief-action--complete"
              onClick={() => setShowNoteInput(true)}
            >
              <Check size={18} />
              <span>Mark completed</span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

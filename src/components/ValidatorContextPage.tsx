import React, { useState } from 'react';
import { 
  ArrowLeft,
  Key, 
  Search, 
  Check, 
  X, 
  ExternalLink,
  Shield,
  Activity,
  Vote,
  Info,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ValidatorContextPage.css';

export function ValidatorContextPage() {
  const { state, dispatch, lookupValidator, refreshLiveData } = useApp();
  const [inputKey, setInputKey] = useState(
    state.preferences.validatorContext.publicKey || ''
  );
  const [saved, setSaved] = useState(false);
  
  const hasValidatorKey = !!state.preferences.validatorContext.publicKey;
  const isSearching = state.isLoading;
  const isConnected = state.liveAmendments.length > 0 && !state.error;
  
  const validatorVotes = state.validatorVotes;
  const pendingAmendments = state.liveAmendments.filter(a => a.supported && !a.enabled);
  const enabledAmendments = state.liveAmendments.filter(a => a.enabled);
  const votedCount = validatorVotes.length;
  const totalPending = pendingAmendments.length || state.amendments.length;
  const notVotedCount = Math.max(0, totalPending - votedCount);
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  const handleLookup = async () => {
    if (!inputKey.trim()) return;
    await lookupValidator(inputKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleClear = () => {
    setInputKey('');
    dispatch({ type: 'SET_VALIDATOR_KEY', publicKey: undefined });
    dispatch({ type: 'TOGGLE_VALIDATOR_STATUS', show: false });
    dispatch({ type: 'SET_VALIDATOR_VOTES', votes: [] });
  };
  
  const handleRefresh = () => {
    refreshLiveData();
  };

  return (
    <div className="validator-context-page">
      <div className="vcp-inner">
        <header className="vcp-header">
          <button className="vcp-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="vcp-title-section">
            <div className="vcp-icon">
              <Key size={24} />
            </div>
            <div>
              <h1 className="vcp-title">Validator Context</h1>
              <p className="vcp-subtitle">View your validator's governance activity</p>
            </div>
          </div>
          <div className="vcp-status">
            {isConnected ? (
              <span className="status-badge connected">
                <Wifi size={14} />
                Connected to XRPL
              </span>
            ) : (
              <span className="status-badge disconnected">
                <WifiOff size={14} />
                Offline
              </span>
            )}
            <button 
              className="vcp-refresh" 
              onClick={handleRefresh}
              disabled={isSearching}
              title="Refresh data"
            >
              <RefreshCw size={16} className={isSearching ? 'spinning' : ''} />
            </button>
          </div>
        </header>

        {state.error && (
          <div className="vcp-error">
            <AlertCircle size={16} />
            <span>{state.error}</span>
            <button onClick={handleRefresh}>Retry</button>
          </div>
        )}

        <section className="vcp-lookup-section glass-card">
          <h2 className="section-title">
            <Key size={18} />
            Validator Public Key
          </h2>
          <p className="section-description">
            Enter your validator's public key to see which amendments you have signaled support for.
            <span className="privacy-badge">
              <Shield size={12} />
              Stored locally only
            </span>
          </p>
          
          <div className="lookup-form">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                onPaste={(e) => {
                  const pastedText = e.clipboardData.getData('text');
                  if (pastedText) {
                    e.preventDefault();
                    setInputKey(pastedText.trim());
                  }
                }}
                placeholder="nHU4bLE3EmSqNwfL4AP1UZeTNPrSPPP6FXLKXo2uqfHuvBQxDVKd"
                className="lookup-input"
                disabled={isSearching}
                autoComplete="off"
                spellCheck={false}
              />
              {inputKey && !isSearching && (
                <button 
                  className="clear-input"
                  onClick={() => setInputKey('')}
                  aria-label="Clear input"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <button 
              className={`lookup-btn ${saved ? 'saved' : ''}`}
              onClick={handleLookup}
              disabled={!inputKey.trim() || isSearching}
            >
              {isSearching ? (
                <>
                  <span className="spinner" />
                  <span>Looking up...</span>
                </>
              ) : saved ? (
                <>
                  <Check size={18} />
                  <span>Found</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Look up validator</span>
                </>
              )}
            </button>
          </div>
          
          {hasValidatorKey && (
            <div className="current-validator">
              <Activity size={14} className="status-dot" />
              <span className="validator-key">
                {state.preferences.validatorContext.publicKey?.slice(0, 16)}...
                {state.preferences.validatorContext.publicKey?.slice(-12)}
              </span>
              <button className="clear-btn" onClick={handleClear}>
                Clear
              </button>
            </div>
          )}
        </section>

        {hasValidatorKey && (
          <>
            <section className="vcp-stats-section">
              <div className="stat-card glass-card voted">
                <div className="stat-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{votedCount}</span>
                  <span className="stat-label">Amendments Voted</span>
                </div>
              </div>
              
              <div className="stat-card glass-card pending">
                <div className="stat-icon">
                  <Vote size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{notVotedCount}</span>
                  <span className="stat-label">Not Yet Voted</span>
                </div>
              </div>
              
              <div className="stat-card glass-card total">
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{totalPending}</span>
                  <span className="stat-label">Pending Amendments</span>
                </div>
              </div>
            </section>

            <section className="vcp-votes-section glass-card">
              <h2 className="section-title">
                <CheckCircle2 size={18} />
                Amendments You've Signaled Support For
              </h2>
              
              {validatorVotes.length > 0 ? (
                <div className="votes-grid">
                  {validatorVotes.map((amendmentName, index) => {
                    const amendment = state.amendments.find(a => 
                      a.id === amendmentName || a.name === amendmentName
                    );
                    const liveAmendment = state.liveAmendments.find(a => 
                      a.name === amendmentName || a.id === amendmentName
                    );
                    
                    return (
                      <button
                        key={amendmentName + index}
                        className="vote-item"
                        onClick={() => amendment && dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id })}
                      >
                        <Check size={16} className="vote-check" />
                        <span className="vote-name">{liveAmendment?.name || amendmentName}</span>
                        {amendment && <ExternalLink size={12} className="vote-link" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="no-votes">
                  <Info size={20} />
                  <p>
                    {isConnected 
                      ? 'No votes recorded for pending amendments' 
                      : 'Connect to XRPL to see voting data'}
                  </p>
                </div>
              )}
            </section>

            <section className="vcp-pending-section glass-card">
              <h2 className="section-title">
                <Vote size={18} />
                Amendments Awaiting Your Vote
              </h2>
              
              {pendingAmendments.length > 0 ? (
                <div className="pending-list">
                  {pendingAmendments
                    .filter(a => !validatorVotes.includes(a.name))
                    .slice(0, 10)
                    .map((amendment, index) => {
                      const localAmendment = state.amendments.find(a => 
                        a.name === amendment.name || a.id === amendment.id
                      );
                      
                      return (
                        <div key={amendment.id + index} className="pending-item">
                          <div className="pending-info">
                            <span className="pending-name">{amendment.name}</span>
                            {amendment.count !== undefined && (
                              <span className="pending-votes">
                                {amendment.count} validators supporting
                              </span>
                            )}
                          </div>
                          {localAmendment && (
                            <button
                              className="view-btn"
                              onClick={() => dispatch({ type: 'SELECT_AMENDMENT', id: localAmendment.id })}
                            >
                              View details
                              <ExternalLink size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="no-pending">
                  <Check size={20} />
                  <p>All pending amendments have your support</p>
                </div>
              )}
            </section>
          </>
        )}

        {isConnected && (
          <section className="vcp-network-section glass-card">
            <h2 className="section-title">
              <Wifi size={18} />
              Network Status
            </h2>
            <div className="network-stats">
              <div className="network-stat">
                <span className="ns-value">{enabledAmendments.length}</span>
                <span className="ns-label">Enabled Amendments</span>
              </div>
              <div className="network-stat">
                <span className="ns-value">{pendingAmendments.length}</span>
                <span className="ns-label">Pending Amendments</span>
              </div>
              <div className="network-stat">
                <span className="ns-value">{state.networkStats.validatorCount}</span>
                <span className="ns-label">Validators Required</span>
              </div>
            </div>
          </section>
        )}

        <footer className="vcp-footer">
          <div className="disclaimer">
            <Info size={14} />
            <p>
              Data fetched from XRPL mainnet. Validator-specific voting signals are based on 
              publicly observable network data. This information is provided for reference only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

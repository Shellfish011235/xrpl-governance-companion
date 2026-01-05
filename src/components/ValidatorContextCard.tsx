import React, { useState } from 'react';
import { 
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
  WifiOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ValidatorContextCard.css';

export function ValidatorContextCard() {
  const { state, dispatch, lookupValidator, refreshLiveData, hasVoted } = useApp();
  const [inputKey, setInputKey] = useState(
    state.preferences.validatorContext.publicKey || ''
  );
  const [saved, setSaved] = useState(false);
  
  const hasValidatorKey = !!state.preferences.validatorContext.publicKey;
  const isSearching = state.isLoading;
  const isConnected = state.liveAmendments.length > 0 && !state.error;
  
  // Get votes from live XRPL data
  const validatorVotes = state.validatorVotes;
  
  // Count pending (not enabled) amendments
  const pendingAmendments = state.liveAmendments.filter(a => a.supported && !a.enabled);
  const votedCount = validatorVotes.length;
  const totalAmendments = pendingAmendments.length || state.amendments.length;
  const notVotedCount = Math.max(0, totalAmendments - votedCount);
  
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
    <div className="validator-context-card glass-card">
      <div className="vcc-header">
        <div className="vcc-icon">
          <Key size={20} />
        </div>
        <div className="vcc-title-section">
          <h3 className="vcc-title">Validator Context</h3>
          <span className="vcc-badge">Optional</span>
        </div>
        <div className="vcc-network-status">
          {isConnected ? (
            <span className="network-badge connected">
              <Wifi size={12} />
              Live
            </span>
          ) : (
            <span className="network-badge disconnected">
              <WifiOff size={12} />
              Offline
            </span>
          )}
          <button 
            className="vcc-refresh-btn" 
            onClick={handleRefresh}
            disabled={isSearching}
            title="Refresh XRPL data"
          >
            <RefreshCw size={14} className={isSearching ? 'spinning' : ''} />
          </button>
        </div>
      </div>
      
      {state.error && (
        <div className="vcc-error">
          <Info size={14} />
          <span>{state.error}</span>
        </div>
      )}
      
      <p className="vcc-description">
        Enter your validator's public key to see which amendments you have signaled support for.
        <span className="vcc-privacy">
          <Shield size={12} />
          Stored locally only
        </span>
      </p>
      
      <div className="vcc-input-section">
        <div className="vcc-input-wrapper">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            onPaste={(e) => {
              // Explicitly handle paste
              const pastedText = e.clipboardData.getData('text');
              if (pastedText) {
                e.preventDefault();
                setInputKey(pastedText.trim());
              }
            }}
            placeholder="nHU4bLE3EmSqNwfL4AP1UZeTNPrSPPP6FXLKXo2uqfHuvBQxDVKd"
            className="vcc-input"
            disabled={isSearching}
            autoComplete="off"
            spellCheck={false}
          />
          {inputKey && !isSearching && (
            <button 
              className="vcc-clear-input"
              onClick={() => setInputKey('')}
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <button 
          className={`vcc-lookup-btn ${saved ? 'saved' : ''}`}
          onClick={handleLookup}
          disabled={!inputKey.trim() || isSearching}
        >
          {isSearching ? (
            <>
              <span className="vcc-spinner" />
              <span>Looking up...</span>
            </>
          ) : saved ? (
            <>
              <Check size={16} />
              <span>Found</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>Look up</span>
            </>
          )}
        </button>
      </div>
      
      {hasValidatorKey && (
        <div className="vcc-results">
          <div className="vcc-validator-info">
            <div className="vcc-validator-key">
              <Activity size={14} className="vcc-status-icon active" />
              <span className="vcc-key-text">
                {state.preferences.validatorContext.publicKey?.slice(0, 12)}...
                {state.preferences.validatorContext.publicKey?.slice(-8)}
              </span>
              <button className="vcc-clear-btn" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>
          
          <div className="vcc-voting-summary">
            <div className="vcc-vote-stat">
              <div className="vcc-vote-count voted">{votedCount}</div>
              <div className="vcc-vote-label">
                <Vote size={12} />
                Voted
              </div>
            </div>
            <div className="vcc-vote-divider" />
            <div className="vcc-vote-stat">
              <div className="vcc-vote-count not-voted">{notVotedCount}</div>
              <div className="vcc-vote-label">Not voted</div>
            </div>
            <div className="vcc-vote-divider" />
            <div className="vcc-vote-stat">
              <div className="vcc-vote-count total">{totalAmendments}</div>
              <div className="vcc-vote-label">Total</div>
            </div>
          </div>
          
          <div className="vcc-voted-list">
            <h4 className="vcc-voted-title">Amendments you've signaled support for:</h4>
            <div className="vcc-voted-items">
              {validatorVotes.length > 0 ? (
                validatorVotes.map((amendmentName, index) => {
                  const amendment = state.amendments.find(a => 
                    a.id === amendmentName || a.name === amendmentName
                  );
                  const liveAmendment = state.liveAmendments.find(a => 
                    a.name === amendmentName || a.id === amendmentName
                  );
                  
                  return (
                    <button
                      key={amendmentName + index}
                      className="vcc-voted-item"
                      onClick={() => amendment && dispatch({ type: 'SELECT_AMENDMENT', id: amendment.id })}
                    >
                      <Check size={12} className="vcc-check" />
                      <span>{liveAmendment?.name || amendmentName}</span>
                      {amendment && <ExternalLink size={10} />}
                    </button>
                  );
                })
              ) : (
                <p className="vcc-no-votes">
                  {isConnected 
                    ? 'No votes recorded for pending amendments' 
                    : 'Connect to XRPL to see voting data'}
                </p>
              )}
            </div>
          </div>
          
          {isConnected && (
            <div className="vcc-live-stats">
              <span className="live-stat">
                <strong>{state.liveAmendments.filter(a => a.enabled).length}</strong> enabled
              </span>
              <span className="live-stat">
                <strong>{pendingAmendments.length}</strong> pending
              </span>
              <span className="live-stat">
                <strong>{state.networkStats.validatorCount}</strong> validators
              </span>
            </div>
          )}
          
          <div className="vcc-disclaimer">
            <Info size={12} />
            <p>
              Data fetched from XRPL mainnet via public WebSocket endpoints.
              Validator-specific votes require analysis of validation messages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

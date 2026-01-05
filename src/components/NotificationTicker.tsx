import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './NotificationTicker.css';

export function NotificationTicker() {
  const { state, dispatch, fixOnlyCount } = useApp();
  
  if (!state.preferences.notifications.inAppTicker) {
    return null;
  }
  
  const fixOnlyAmendments = state.amendments.filter(
    a => a.tier === 'A' && a.performanceImpact === 'Low'
  );
  const oldestWaitingDays = Math.max(...fixOnlyAmendments.map(a => a.waitingDays));
  
  const messageId = `fix-only-${fixOnlyCount}-${oldestWaitingDays}`;
  
  if (state.preferences.dismissedTickerMessages.includes(messageId) || fixOnlyCount === 0) {
    return null;
  }
  
  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_TICKER', messageId });
  };
  
  return (
    <div className="notification-ticker">
      <div className="notification-ticker-inner">
        <div className="ticker-content">
          <AlertTriangle size={16} className="ticker-icon" />
          <span className="ticker-text">
            {fixOnlyCount} fix-only amendment{fixOnlyCount !== 1 ? 's' : ''} waiting • Oldest: {oldestWaitingDays} days
          </span>
        </div>
        <button 
          className="ticker-dismiss" 
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

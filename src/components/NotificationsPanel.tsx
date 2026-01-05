import React from 'react';
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle,
  TrendingUp,
  Check,
  Calendar,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './NotificationsPanel.css';

export function NotificationsPanel() {
  const { state, dispatch, fixOnlyCount, nearThresholdCount } = useApp();
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  const handleOpenSettings = () => {
    dispatch({ type: 'SET_VIEW', view: 'settings' });
    dispatch({ type: 'SET_SETTINGS_TAB', tab: 'notifications' });
  };
  
  // Generate notifications based on current state
  const notifications = [];
  
  // Fix-only amendments waiting
  if (fixOnlyCount > 0) {
    const fixOnlyAmendments = state.amendments.filter(
      a => a.tier === 'A' && a.performanceImpact === 'Low'
    );
    const oldestWaiting = Math.max(...fixOnlyAmendments.map(a => a.waitingDays));
    notifications.push({
      id: 'fix-only',
      type: 'attention',
      icon: AlertTriangle,
      title: `${fixOnlyCount} fix-only amendment${fixOnlyCount !== 1 ? 's' : ''} waiting`,
      description: `Oldest has been waiting ${oldestWaiting} days. These are typically safe to review first.`,
      action: () => dispatch({ type: 'SET_VIEW', view: 'home' })
    });
  }
  
  // Near threshold
  if (nearThresholdCount > 0) {
    notifications.push({
      id: 'near-threshold',
      type: 'info',
      icon: TrendingUp,
      title: `${nearThresholdCount} amendment${nearThresholdCount !== 1 ? 's' : ''} near activation threshold`,
      description: 'These amendments need only a few more validators to reach 80% support.',
      action: () => dispatch({ type: 'SET_VIEW', view: 'home' })
    });
  }
  
  // Weekly digest available
  notifications.push({
    id: 'weekly-digest',
    type: 'neutral',
    icon: Calendar,
    title: 'Weekly digest available',
    description: 'View what changed, what\'s close, and what you\'ve completed.',
    action: () => dispatch({ type: 'SET_VIEW', view: 'digest' })
  });
  
  // Completed items
  const completedCount = state.preferences.completedAmendments.length;
  if (completedCount > 0) {
    notifications.push({
      id: 'completed',
      type: 'success',
      icon: Check,
      title: `${completedCount} amendment${completedCount !== 1 ? 's' : ''} marked as reviewed`,
      description: 'Your completion records are stored locally on this device.',
      action: null
    });
  }
  
  return (
    <div className="notifications-panel">
      <div className="notifications-inner">
        <header className="notifications-header">
          <button className="notifications-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="notifications-title">Notifications</h1>
          <button className="notifications-settings" onClick={handleOpenSettings}>
            <Settings size={18} />
          </button>
        </header>
        
        <div className="notifications-list">
          {notifications.map(notification => {
            const Icon = notification.icon;
            return (
              <div 
                key={notification.id}
                className={`notification-item notification-item--${notification.type}`}
              >
                <div className="notification-icon">
                  <Icon size={18} />
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-description">{notification.description}</p>
                </div>
                {notification.action && (
                  <button 
                    className="notification-action"
                    onClick={notification.action}
                  >
                    View
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {notifications.length === 0 && (
          <div className="notifications-empty">
            <Bell size={32} className="empty-icon" />
            <p>No notifications at this time.</p>
          </div>
        )}
        
        <footer className="notifications-footer">
          <p>
            Notifications are generated based on current amendment data. 
            <button onClick={handleOpenSettings}>Configure notification preferences</button>
          </p>
        </footer>
      </div>
    </div>
  );
}

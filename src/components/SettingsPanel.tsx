import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Key, 
  Bell, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clearAllData } from '../utils/storage';
import './SettingsPanel.css';

export function SettingsPanel() {
  const { state, dispatch } = useApp();
  const [publicKey, setPublicKey] = useState(
    state.preferences.validatorContext.publicKey || ''
  );
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  const handleSaveKey = () => {
    dispatch({ type: 'SET_VALIDATOR_KEY', publicKey: publicKey.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const handleClearKey = () => {
    setPublicKey('');
    dispatch({ type: 'SET_VALIDATOR_KEY', publicKey: undefined });
    dispatch({ type: 'TOGGLE_VALIDATOR_STATUS', show: false });
  };
  
  const handleToggleStatus = () => {
    dispatch({ 
      type: 'TOGGLE_VALIDATOR_STATUS', 
      show: !state.preferences.validatorContext.showStatus 
    });
  };
  
  const handleClearAllData = () => {
    clearAllData();
    window.location.reload();
  };
  
  const updateNotificationSetting = (key: string, value: boolean | string) => {
    dispatch({
      type: 'UPDATE_PREFERENCES',
      preferences: {
        notifications: {
          ...state.preferences.notifications,
          [key]: value
        }
      }
    });
  };
  
  return (
    <div className="settings-panel">
      <div className="settings-inner">
        <header className="settings-header">
          <button className="settings-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="settings-title">Settings</h1>
        </header>
        
        <div className="settings-tabs">
          <button
            className={`settings-tab ${state.settingsTab === 'validator' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_SETTINGS_TAB', tab: 'validator' })}
          >
            <Key size={18} />
            <span>Validator Context</span>
          </button>
          <button
            className={`settings-tab ${state.settingsTab === 'notifications' ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_SETTINGS_TAB', tab: 'notifications' })}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>
        </div>
        
        <div className="settings-content">
          {state.settingsTab === 'validator' ? (
            <div className="settings-section">
              {/* Validator Public Key */}
              <div className="setting-group">
                <label className="setting-label">
                  <Key size={16} />
                  Validator Public Key
                  <span className="setting-optional">optional</span>
                </label>
                <p className="setting-helper">
                  Used only to check publicly observable network data.
                  Stored locally unless cleared.
                </p>
                <div className="setting-input-group">
                  <input
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="nHU..."
                    className="setting-input"
                  />
                  <button 
                    className="setting-btn setting-btn--save"
                    onClick={handleSaveKey}
                    disabled={!publicKey.trim()}
                  >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    <span>{saved ? 'Saved' : 'Save locally'}</span>
                  </button>
                  {publicKey && (
                    <button 
                      className="setting-btn setting-btn--clear"
                      onClick={handleClearKey}
                    >
                      <Trash2 size={16} />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Validator Status Toggle */}
              <div className="setting-group">
                <div className="setting-toggle-row">
                  <div className="setting-toggle-info">
                    <label className="setting-label">
                      {state.preferences.validatorContext.showStatus ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                      Show Validator Status (Public Signals)
                    </label>
                    <p className="setting-helper">
                      Displays publicly observable activity signals.
                      Not a guarantee of uptime.
                    </p>
                  </div>
                  <button 
                    className={`toggle-switch ${state.preferences.validatorContext.showStatus ? 'active' : ''}`}
                    onClick={handleToggleStatus}
                    disabled={!state.preferences.validatorContext.publicKey}
                    aria-pressed={state.preferences.validatorContext.showStatus}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                
                {state.preferences.validatorContext.showStatus && state.preferences.validatorContext.publicKey && (
                  <div className="validator-status-preview">
                    <h4 className="status-preview-title">Public Signals (Simulated)</h4>
                    <div className="status-items">
                      <div className="status-item">
                        <span className="status-label">UNL presence</span>
                        <span className="status-value status-value--yes">Yes</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Recently validating</span>
                        <span className="status-value status-value--yes">Yes</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Last observed validation</span>
                        <span className="status-value">~2 min ago</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Observed participation</span>
                        <span className="status-value">High</span>
                      </div>
                      <div className="status-item">
                        <span className="status-label">Governance signaling</span>
                        <span className="status-value">3 / 7 active amendments</span>
                      </div>
                    </div>
                    <p className="status-disclaimer">
                      <Info size={12} />
                      Data shown is simulated. Real data requires network integration.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Danger Zone */}
              <div className="setting-group setting-group--danger">
                <label className="setting-label">
                  <AlertCircle size={16} />
                  Clear All Local Data
                </label>
                <p className="setting-helper">
                  This will remove all your local preferences, completion records, and dismissed notifications. This action cannot be undone.
                </p>
                {showClearConfirm ? (
                  <div className="clear-confirm">
                    <span>Are you sure? This cannot be undone.</span>
                    <div className="clear-actions">
                      <button 
                        className="setting-btn setting-btn--cancel"
                        onClick={() => setShowClearConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="setting-btn setting-btn--danger"
                        onClick={handleClearAllData}
                      >
                        <Trash2 size={16} />
                        <span>Clear all data</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="setting-btn setting-btn--warning"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    <Trash2 size={16} />
                    <span>Clear all data...</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="settings-section">
              {/* In-App Notifications */}
              <div className="setting-group">
                <h3 className="setting-group-title">In-App Notifications</h3>
                <p className="setting-helper">These are enabled by default.</p>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Notification ticker</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.inAppTicker ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('inAppTicker', !state.preferences.notifications.inAppTicker)}
                    aria-pressed={state.preferences.notifications.inAppTicker}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Subtle highlights</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.inAppHighlights ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('inAppHighlights', !state.preferences.notifications.inAppHighlights)}
                    aria-pressed={state.preferences.notifications.inAppHighlights}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </div>
              
              {/* OS Notifications */}
              <div className="setting-group">
                <h3 className="setting-group-title">OS Notifications</h3>
                <p className="setting-helper">These require browser permission and are off by default.</p>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Tier A amendments waiting</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.osTierAWaiting ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('osTierAWaiting', !state.preferences.notifications.osTierAWaiting)}
                    aria-pressed={state.preferences.notifications.osTierAWaiting}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Near threshold alerts</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.osNearThreshold ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('osNearThreshold', !state.preferences.notifications.osNearThreshold)}
                    aria-pressed={state.preferences.notifications.osNearThreshold}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Weekly digest</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.osWeeklyDigest ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('osWeeklyDigest', !state.preferences.notifications.osWeeklyDigest)}
                    aria-pressed={state.preferences.notifications.osWeeklyDigest}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label">Incomplete items reminder</span>
                  <button 
                    className={`toggle-switch ${state.preferences.notifications.osIncompleteItems ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('osIncompleteItems', !state.preferences.notifications.osIncompleteItems)}
                    aria-pressed={state.preferences.notifications.osIncompleteItems}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </div>
              
              {/* Notification Controls */}
              <div className="setting-group">
                <h3 className="setting-group-title">Controls</h3>
                
                <div className="setting-select-row">
                  <span className="select-label">Frequency</span>
                  <select 
                    value={state.preferences.notifications.frequency}
                    onChange={(e) => updateNotificationSetting('frequency', e.target.value)}
                    className="setting-select"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                
                <div className="setting-toggle-row">
                  <span className="toggle-label toggle-label--kill">Kill switch (disable all)</span>
                  <button 
                    className={`toggle-switch toggle-switch--kill ${!state.preferences.notifications.enabled ? 'active' : ''}`}
                    onClick={() => updateNotificationSetting('enabled', !state.preferences.notifications.enabled)}
                    aria-pressed={!state.preferences.notifications.enabled}
                  >
                    <span className="toggle-knob" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

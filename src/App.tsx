import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import {
  Header,
  ProgressHero,
  NotificationTicker,
  NeedsAttentionPanel,
  AmendmentList,
  AmendmentBrief,
  SettingsPanel,
  WeeklyDigest,
  ReferencesPanel,
  GovernanceGuide,
  NotificationsPanel,
  AssistantSidebar,
  ValidatorLink,
  ValidatorContextPage
} from './components';
import './App.css';

function AppContent() {
  const { state } = useApp();
  
  const renderContent = () => {
    switch (state.activeView) {
      case 'amendment':
        return <AmendmentBrief />;
      case 'settings':
        return <SettingsPanel />;
      case 'digest':
        return <WeeklyDigest />;
      case 'references':
        return <ReferencesPanel />;
      case 'guide':
        return <GovernanceGuide />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'validator':
        return <ValidatorContextPage />;
      case 'home':
      default:
        return (
          <div className="home-layout">
            <div className="main-content">
              <ProgressHero />
              <NotificationTicker />
              <NeedsAttentionPanel />
              <AmendmentList />
              <ValidatorLink />
            </div>
            <AssistantSidebar />
          </div>
        );
    }
  };
  
  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

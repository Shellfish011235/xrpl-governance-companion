import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Book, 
  Github, 
  FileText, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ReferencesPanel.css';

export function ReferencesPanel() {
  const { dispatch } = useApp();
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  const resources = [
    {
      category: 'Official Documentation',
      icon: Book,
      items: [
        { label: 'XRPL Amendments Overview', url: 'https://xrpl.org/amendments.html' },
        { label: 'Known Amendments List', url: 'https://xrpl.org/known-amendments.html' },
        { label: 'Amendment Process', url: 'https://xrpl.org/amendments.html#amendment-process' },
        { label: 'Validator Guide', url: 'https://xrpl.org/run-a-rippled-validator.html' }
      ]
    },
    {
      category: 'GitHub Resources',
      icon: Github,
      items: [
        { label: 'rippled Repository', url: 'https://github.com/XRPLF/rippled' },
        { label: 'XRPL Standards (XLS)', url: 'https://github.com/XRPLF/XRPL-Standards' },
        { label: 'Amendment Proposals', url: 'https://github.com/XRPLF/rippled/labels/amendment' },
        { label: 'Release Notes', url: 'https://github.com/XRPLF/rippled/releases' }
      ]
    },
    {
      category: 'Community & Discussion',
      icon: MessageSquare,
      items: [
        { label: 'XRPL Developers Discord', url: 'https://discord.gg/xrpl' },
        { label: 'XRP Ledger Foundation', url: 'https://foundation.xrpl.org/' },
        { label: 'Developer Forums', url: 'https://github.com/XRPLF/rippled/discussions' }
      ]
    },
    {
      category: 'Network Tools',
      icon: Globe,
      items: [
        { label: 'XRPL Explorer', url: 'https://livenet.xrpl.org/' },
        { label: 'Validator Registry', url: 'https://vl.xrplf.org/' },
        { label: 'Network Status', url: 'https://xrpl.org/stats.html' }
      ]
    }
  ];
  
  return (
    <div className="references-panel">
      <div className="references-inner">
        <header className="references-header">
          <button className="references-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="references-title">References</h1>
        </header>
        
        <p className="references-intro">
          Curated resources for understanding XRPL governance, amendments, and validator operations.
        </p>
        
        <div className="references-grid">
          {resources.map(({ category, icon: Icon, items }) => (
            <section key={category} className="reference-category">
              <div className="category-header">
                <Icon size={18} className="category-icon" />
                <h2 className="category-title">{category}</h2>
              </div>
              <ul className="reference-list">
                {items.map(({ label, url }) => (
                  <li key={url}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="reference-link"
                    >
                      <span>{label}</span>
                      <ExternalLink size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        
        <footer className="references-footer">
          <p>
            <FileText size={14} />
            All links open in new tabs. Resources are provided for informational purposes.
          </p>
        </footer>
      </div>
    </div>
  );
}

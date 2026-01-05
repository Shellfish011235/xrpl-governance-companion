import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Info,
  Shield,
  Zap,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './GovernanceGuide.css';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ElementType;
}

export function GovernanceGuide() {
  const { dispatch } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', view: 'home' });
  };
  
  const faqs: FAQItem[] = [
    {
      question: 'What are XRPL amendments?',
      answer: 'Amendments are changes to the XRP Ledger protocol that require validator consensus to activate. They can introduce new features, fix bugs, or modify existing behavior. Amendments are identified by unique hashes and require 80% validator support for two weeks to become active.',
      icon: Info
    },
    {
      question: 'What do the tier classifications mean?',
      answer: 'Tier A amendments are typically bug fixes or minor improvements with minimal risk. Tier B amendments introduce new features or significant changes. Tier C amendments involve substantial protocol changes that may require more careful consideration. These tiers are informational and provided to help prioritize review.',
      icon: Shield
    },
    {
      question: 'How is performance impact determined?',
      answer: 'Performance impact estimates are based on technical analysis, benchmarks, and developer documentation. "Low" indicates minimal resource changes, "Medium" suggests moderate impact on specific operations, and "High" means significant changes to resource usage. "Unknown" indicates insufficient data for assessment.',
      icon: Zap
    },
    {
      question: 'What does "clarity" indicate?',
      answer: 'Clarity reflects the availability and quality of documentation and technical analysis for an amendment—not community sentiment or opinion. High clarity means extensive documentation exists. Low clarity indicates limited publicly available information.',
      icon: Users
    },
    {
      question: 'How long does activation take?',
      answer: 'Once an amendment reaches 80% validator support, it must maintain that support for approximately two weeks (256 flag ledgers) before automatically activating. The "waiting days" shown indicates how long an amendment has been in the voting period.',
      icon: Clock
    },
    {
      question: 'What does marking an amendment as "completed" do?',
      answer: 'Marking an amendment as completed is a private record stored only on your device. It helps you track which amendments you have personally reviewed. This has no effect on the network and does not constitute a vote.',
      icon: CheckCircle
    },
    {
      question: 'Does this app vote on amendments?',
      answer: 'No. This application is strictly read-only and informational. It does not connect to your validator, execute transactions, or influence the network in any way. Actual voting occurs through your validator\'s configuration.',
      icon: AlertTriangle
    }
  ];
  
  return (
    <div className="governance-guide">
      <div className="guide-inner">
        <header className="guide-header">
          <button className="guide-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div className="guide-title-section">
            <div className="guide-avatar">
              <HelpCircle size={24} />
            </div>
            <div>
              <h1 className="guide-title">Governance Guide</h1>
              <p className="guide-badge">Informational only</p>
            </div>
          </div>
        </header>
        
        <div className="guide-intro">
          <p>
            This guide provides factual information about XRPL governance and how to use this companion application. All information is presented neutrally for educational purposes.
          </p>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <Icon size={18} className="faq-icon" />
                  <span className="faq-question-text">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="faq-chevron" />
                  ) : (
                    <ChevronDown size={18} className="faq-chevron" />
                  )}
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <footer className="guide-footer">
          <div className="guide-disclaimer">
            <Info size={16} />
            <p>
              This guide is provided for informational purposes only. Always consult official XRPL documentation and community resources for the most current information.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

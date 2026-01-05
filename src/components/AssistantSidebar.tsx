import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, HelpCircle, AlertTriangle, FileText, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAssistantResponse, getQuickQuestions, AssistantResponse } from '../utils/assistantResponses';
import './AssistantSidebar.css';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  responseType?: AssistantResponse['type'];
  followUp?: string[];
  timestamp: Date;
}

export function AssistantSidebar() {
  const { state, getAmendment } = useApp();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const selectedAmendment = state.selectedAmendmentId 
    ? getAmendment(state.selectedAmendmentId) 
    : undefined;
  
  const quickQuestions = getQuickQuestions(selectedAmendment);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add welcome message on mount or when amendment changes
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: selectedAmendment 
          ? `I can help you understand **${selectedAmendment.name}**. Ask me anything about this amendment!`
          : "Hi! I'm your governance guide. Ask me about amendments, voting, or how to use this app.",
        responseType: 'info',
        followUp: quickQuestions,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);
  
  // Update context message when amendment selection changes
  useEffect(() => {
    if (selectedAmendment && messages.length > 0) {
      const contextMessage: ChatMessage = {
        id: `context-${Date.now()}`,
        type: 'assistant',
        content: `Now viewing **${selectedAmendment.name}**. What would you like to know?`,
        responseType: 'info',
        followUp: quickQuestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [state.selectedAmendmentId]);
  
  const handleSend = async (text?: string) => {
    const queryText = text || question.trim();
    if (!queryText) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: queryText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsTyping(true);
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Get response
    const response = getAssistantResponse(queryText, selectedAmendment, {
      totalAmendments: state.amendments.length,
      pendingCount: state.liveAmendments.filter(a => a.supported && !a.enabled).length,
      completedCount: state.preferences.completedAmendments.length,
      validatorKey: state.preferences.validatorContext.publicKey
    });
    
    // Add assistant message
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: response.message,
      responseType: response.type,
      followUp: response.followUp,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };
  
  const clearChat = () => {
    setMessages([{
      id: 'welcome-new',
      type: 'assistant',
      content: selectedAmendment 
        ? `Chat cleared. I can still help you understand **${selectedAmendment.name}**.`
        : "Chat cleared. Ask me anything about XRPL governance!",
      responseType: 'info',
      followUp: quickQuestions,
      timestamp: new Date()
    }]);
  };
  
  const getResponseIcon = (type?: AssistantResponse['type']) => {
    switch (type) {
      case 'amendment': return <FileText size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      case 'help': return <HelpCircle size={14} />;
      default: return <Info size={14} />;
    }
  };
  
  // Format message with basic markdown
  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />');
  };
  
  return (
    <aside className="assistant-sidebar">
      <div className="assistant-avatar-section">
        <div className="assistant-avatar">
          <div className="avatar-ethereal">
            <div className="avatar-core"></div>
            <div className="avatar-ring ring-1"></div>
            <div className="avatar-ring ring-2"></div>
            <div className="avatar-ring ring-3"></div>
            <div className="avatar-particles">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
            <div className="avatar-silhouette"></div>
          </div>
          <div className="avatar-glow"></div>
        </div>
        <h3 className="assistant-greeting">Governance Guide</h3>
        <p className="assistant-label">Informational only</p>
      </div>
      
      <div className="assistant-chat glass-card">
        <div className="chat-header">
          <span>Ask me anything</span>
          {messages.length > 1 && (
            <button className="clear-chat" onClick={clearChat} title="Clear chat">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.type}`}>
              {msg.type === 'assistant' && (
                <div className={`message-icon ${msg.responseType}`}>
                  {getResponseIcon(msg.responseType)}
                </div>
              )}
              <div className="message-content">
                <div 
                  className="message-text"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
                {msg.followUp && msg.followUp.length > 0 && (
                  <div className="follow-up-questions">
                    {msg.followUp.map((q, i) => (
                      <button 
                        key={i} 
                        className="follow-up-btn"
                        onClick={() => handleQuickQuestion(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-message assistant">
              <div className="message-icon info">
                <Info size={14} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-area">
          <div className="quick-questions">
            {quickQuestions.slice(0, 2).map((q, i) => (
              <button 
                key={i} 
                className="quick-question"
                onClick={() => handleQuickQuestion(q)}
              >
                {q}
              </button>
            ))}
          </div>
          
          <div className="chat-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chat-input"
            />
            <button 
              className="send-btn"
              onClick={() => handleSend()}
              disabled={!question.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

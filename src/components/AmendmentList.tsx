import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AmendmentCard } from './AmendmentCard';
import { Tier, PerformanceImpact } from '../types';
import './AmendmentList.css';

type FilterOption = 'all' | 'completed' | 'not_started';

export function AmendmentList() {
  const { state, isCompleted } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  
  const filteredAmendments = useMemo(() => {
    let result = [...state.amendments];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query)
      );
    }
    
    if (filterStatus === 'completed') {
      result = result.filter(a => isCompleted(a.id));
    } else if (filterStatus === 'not_started') {
      result = result.filter(a => !isCompleted(a.id));
    }
    
    if (filterTier !== 'all') {
      result = result.filter(a => a.tier === filterTier);
    }
    
    // Sort by waiting days descending
    result.sort((a, b) => b.waitingDays - a.waitingDays);
    
    return result;
  }, [state.amendments, searchQuery, filterStatus, filterTier, isCompleted]);
  
  return (
    <section className="amendment-list-section">
      <div className="amendment-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-pills">
          <button 
            className={`filter-pill ${filterTier === 'B' ? 'active' : ''}`}
            onClick={() => setFilterTier(filterTier === 'B' ? 'all' : 'B')}
          >
            Tier B
          </button>
          <button 
            className={`filter-pill ${filterStatus === 'not_started' ? 'active' : ''}`}
            onClick={() => setFilterStatus(filterStatus === 'not_started' ? 'all' : 'not_started')}
          >
            Not enabled
          </button>
        </div>
        
        <button className="filter-dropdown">
          Filter
          <ChevronDown size={16} />
        </button>
      </div>
      
      <div className="amendment-list">
        {filteredAmendments.map(amendment => (
          <AmendmentCard key={amendment.id} amendment={amendment} />
        ))}
        
        {filteredAmendments.length === 0 && (
          <div className="amendment-list-empty glass-card">
            <p>No amendments match your filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}

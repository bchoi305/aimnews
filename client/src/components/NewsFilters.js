import React from 'react';
import Select from 'react-select';

const NewsFilters = ({
  topics,
  selectedTopics,
  daysBack,
  searchQuery,
  summarize,
  onTopicChange,
  onDaysBackChange,
  onSearchChange,
  onSummarizeChange,
  onApplyFilters,
  loading
}) => {
  const topicOptions = topics.map(topic => ({
    value: topic.id,
    label: topic.name,
    description: topic.description
  }));

  const timeOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 3, label: 'Last 3 days' },
    { value: 7, label: 'Last week' },
    { value: 14, label: 'Last 2 weeks' },
    { value: 30, label: 'Last month' }
  ];

  const handleTopicSelectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onTopicChange(values);
  };

  const handleTimeSelectChange = (selectedOption) => {
    onDaysBackChange(selectedOption.value);
  };

  const handleSearchInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleSummarizeChange = (e) => {
    onSummarizeChange(e.target.checked);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onApplyFilters();
    }
  };

  return (
    <div className="news-filters">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Topics</label>
          <Select
            isMulti
            options={topicOptions}
            value={topicOptions.filter(option => selectedTopics.includes(option.value))}
            onChange={handleTopicSelectChange}
            placeholder="Select topics..."
            className="react-select-container"
            classNamePrefix="react-select"
            isDisabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Time Period</label>
          <Select
            options={timeOptions}
            value={timeOptions.find(option => option.value === daysBack)}
            onChange={handleTimeSelectChange}
            placeholder="Select time period..."
            className="react-select-container"
            classNamePrefix="react-select"
            isDisabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-label">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={summarize}
              onChange={handleSummarizeChange}
              disabled={loading}
            />
            {' '}AI Summaries
          </label>
        </div>
      </div>

      <div className="btn-group">
        <button
          className="btn btn-primary"
          onClick={onApplyFilters}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
        
        <button
          className="btn btn-outline"
          onClick={() => {
            onTopicChange(['medicine', 'radiology', 'cardiovascular']);
            onDaysBackChange(7);
            onSearchChange('');
            onSummarizeChange(false);
          }}
          disabled={loading}
        >
          Reset Filters
        </button>
      </div>

      <style jsx>{`
        .react-select-container {
          margin-bottom: 0;
        }
        
        .react-select__control {
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          min-height: 44px;
        }
        
        .react-select__control:hover {
          border-color: #667eea;
        }
        
        .react-select__control--is-focused {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .react-select__multi-value {
          background-color: #667eea;
          color: white;
        }
        
        .react-select__multi-value__label {
          color: white;
        }
        
        .react-select__multi-value__remove {
          color: white;
        }
        
        .react-select__multi-value__remove:hover {
          background-color: #764ba2;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default NewsFilters;
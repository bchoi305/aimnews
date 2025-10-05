import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsFilters from './NewsFilters';
import ArticleList from './ArticleList';

const NewsDashboard = ({ onError, setLoading }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(['medicine', 'radiology', 'cardiovascular']);
  const [daysBack, setDaysBack] = useState(7);
  const [searchQuery, setSearchQuery] = useState('');
  const [summarize, setSummarize] = useState(false);
  const [loading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
    fetchNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/news/topics');
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      onError('Failed to fetch available topics');
    }
  };

  const fetchNews = async () => {
    setLocalLoading(true);
    setLoading(true);
    
    try {
      const params = {
        topics: selectedTopics.join(','),
        daysBack,
        summarize: summarize.toString()
      };

      let response;
      if (searchQuery.trim()) {
        response = await axios.get('/api/news/search', {
          params: { ...params, q: searchQuery }
        });
      } else {
        response = await axios.get('/api/news', { params });
      }

      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      onError('Failed to fetch news articles');
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  };

  const handleTopicChange = (newTopics) => {
    setSelectedTopics(newTopics);
  };

  const handleDaysBackChange = (newDaysBack) => {
    setDaysBack(newDaysBack);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSummarizeChange = (shouldSummarize) => {
    setSummarize(shouldSummarize);
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const handleApplyFilters = () => {
    fetchNews();
  };

  return (
    <div className="news-dashboard">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📰 AI Medicine News</h2>
          <button 
            className="btn btn-primary" 
            onClick={handleRefresh}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
        
        <NewsFilters
          topics={topics}
          selectedTopics={selectedTopics}
          daysBack={daysBack}
          searchQuery={searchQuery}
          summarize={summarize}
          onTopicChange={handleTopicChange}
          onDaysBackChange={handleDaysBackChange}
          onSearchChange={handleSearchChange}
          onSummarizeChange={handleSummarizeChange}
          onApplyFilters={handleApplyFilters}
          loading={loading}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Articles {filteredArticles.length > 0 && `(${filteredArticles.length})`}
          </h3>
          {searchQuery && (
            <span className="text-muted">
              Search results for: "{searchQuery}"
            </span>
          )}
        </div>
        
        <ArticleList 
          articles={filteredArticles} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default NewsDashboard;
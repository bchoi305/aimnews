import React from 'react';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ArticleList = ({ articles, loading }) => {
  if (loading) {
    return (
      <div className="article-list">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="article-card">
            <div className="article-title">
              <Skeleton height={24} width="80%" />
            </div>
            <div className="article-meta">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={80} />
              <Skeleton height={20} width={120} />
            </div>
            <div className="article-description">
              <Skeleton count={3} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No articles found matching your criteria.</p>
        <p className="text-muted">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const getTopicColor = (topic) => {
    const colors = {
      medicine: '#28a745',
      radiology: '#007bff',
      cardiovascular: '#dc3545',
      general: '#6c757d'
    };
    return colors[topic] || colors.general;
  };

  return (
    <div className="article-list">
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          <h3 className="article-title">
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {article.title}
            </a>
          </h3>
          
          <div className="article-meta">
            <span className="article-source">{article.source}</span>
            <span 
              className="article-topic" 
              style={{ 
                backgroundColor: `${getTopicColor(article.topic)}20`,
                color: getTopicColor(article.topic)
              }}
            >
              {article.topic || 'general'}
            </span>
            <span className="article-date">
              {article.publishedDate && 
                format(new Date(article.publishedDate), 'MMM dd, yyyy')
              }
            </span>
          </div>
          
          <div className="article-description">
            {article.description}
          </div>
          
          {article.summary && (
            <div className="article-summary">
              <strong>AI Summary:</strong> {article.summary}
            </div>
          )}
          
          <div className="article-actions">
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="article-link"
            >
              Read full article →
            </a>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ArticleList;
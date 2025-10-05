const express = require('express');
const router = express.Router();
const NewsAggregator = require('../services/newsAggregator');
const AISummarizer = require('../services/aiSummarizer');

const newsAggregator = new NewsAggregator();
const aiSummarizer = new AISummarizer();

// Get news by topics and time range
router.get('/', async (req, res) => {
  try {
    const { topics = 'medicine,radiology,cardiovascular', daysBack = 7, summarize = 'false' } = req.query;
    
    const topicArray = topics.split(',').map(topic => topic.trim());
    const days = parseInt(daysBack);
    
    console.log(`Fetching news for topics: ${topicArray.join(', ')}, days back: ${days}`);
    
    const articles = await newsAggregator.aggregateNews(topicArray, days);
    
    let response = { articles, total: articles.length };
    
    if (summarize === 'true') {
      console.log('Summarizing articles...');
      const summarizedArticles = await aiSummarizer.summarizeMultipleArticles(articles);
      response.articles = summarizedArticles;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get news by specific topic
router.get('/topic/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { daysBack = 7, summarize = 'false' } = req.query;
    
    const days = parseInt(daysBack);
    const articles = await newsAggregator.getNewsByTopic(topic, days);
    
    let response = { articles, total: articles.length, topic };
    
    if (summarize === 'true') {
      const summarizedArticles = await aiSummarizer.summarizeMultipleArticles(articles);
      response.articles = summarizedArticles;
    }
    
    res.json(response);
  } catch (error) {
    console.error(`Error fetching news for topic ${req.params.topic}:`, error);
    res.status(500).json({ error: 'Failed to fetch news for topic' });
  }
});

// Search news
router.get('/search', async (req, res) => {
  try {
    const { q: query, topics = 'medicine,radiology,cardiovascular', daysBack = 7 } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const topicArray = topics.split(',').map(topic => topic.trim());
    const days = parseInt(daysBack);
    
    const articles = await newsAggregator.searchNews(query, topicArray, days);
    
    res.json({ 
      articles, 
      total: articles.length, 
      query,
      topics: topicArray 
    });
  } catch (error) {
    console.error('Error searching news:', error);
    res.status(500).json({ error: 'Failed to search news' });
  }
});

// Get available topics
router.get('/topics', (req, res) => {
  res.json({
    topics: [
      {
        id: 'medicine',
        name: 'AI in Medicine',
        description: 'General AI applications in medicine and healthcare'
      },
      {
        id: 'radiology',
        name: 'AI in Radiology',
        description: 'AI applications in medical imaging and radiology'
      },
      {
        id: 'cardiovascular',
        name: 'AI in Cardiovascular MRI & CT',
        description: 'AI applications in cardiovascular imaging'
      }
    ]
  });
});

module.exports = router;
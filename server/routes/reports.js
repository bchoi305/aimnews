const express = require('express');
const router = express.Router();
const NewsAggregator = require('../services/newsAggregator');
const AISummarizer = require('../services/aiSummarizer');

const newsAggregator = new NewsAggregator();
const aiSummarizer = new AISummarizer();

// Generate weekly report
router.post('/weekly', async (req, res) => {
  try {
    const { 
      topics = ['medicine', 'radiology', 'cardiovascular'], 
      daysBack = 7,
      includeSummaries = true 
    } = req.body;
    
    console.log(`Generating weekly report for topics: ${topics.join(', ')}, days back: ${daysBack}`);
    
    // Fetch articles
    const articles = await newsAggregator.aggregateNews(topics, daysBack);
    
    if (articles.length === 0) {
      return res.status(404).json({ 
        error: 'No articles found for the specified criteria',
        report: '# No Articles Found\n\nNo articles were found for the selected topics and time period.'
      });
    }
    
    // Summarize articles if requested
    let processedArticles = articles;
    if (includeSummaries) {
      console.log('Summarizing articles for report...');
      processedArticles = await aiSummarizer.summarizeMultipleArticles(articles);
    }
    
    // Generate report
    const reportData = await aiSummarizer.generateWeeklyReport(processedArticles, topics);
    
    res.json({
      ...reportData,
      articles: processedArticles,
      parameters: {
        topics,
        daysBack,
        includeSummaries
      }
    });
  } catch (error) {
    console.error('Error generating weekly report:', error);
    res.status(500).json({ error: 'Failed to generate weekly report' });
  }
});

// Generate custom report
router.post('/custom', async (req, res) => {
  try {
    const { 
      topics = ['medicine', 'radiology', 'cardiovascular'], 
      daysBack = 7,
      query,
      reportType = 'summary',
      includeSummaries = true 
    } = req.body;
    
    console.log(`Generating custom report with parameters:`, { topics, daysBack, query, reportType });
    
    // Fetch articles
    let articles;
    if (query) {
      articles = await newsAggregator.searchNews(query, topics, daysBack);
    } else {
      articles = await newsAggregator.aggregateNews(topics, daysBack);
    }
    
    if (articles.length === 0) {
      return res.status(404).json({ 
        error: 'No articles found for the specified criteria',
        report: '# No Articles Found\n\nNo articles were found for the selected criteria.'
      });
    }
    
    // Summarize articles if requested
    let processedArticles = articles;
    if (includeSummaries) {
      console.log('Summarizing articles for custom report...');
      processedArticles = await aiSummarizer.summarizeMultipleArticles(articles);
    }
    
    let reportData;
    
    switch (reportType) {
      case 'detailed':
        reportData = await generateDetailedReport(processedArticles, topics, query);
        break;
      case 'executive':
        reportData = await generateExecutiveReport(processedArticles, topics, query);
        break;
      case 'summary':
      default:
        reportData = await aiSummarizer.generateWeeklyReport(processedArticles, topics);
        break;
    }
    
    res.json({
      ...reportData,
      articles: processedArticles,
      parameters: {
        topics,
        daysBack,
        query,
        reportType,
        includeSummaries
      }
    });
  } catch (error) {
    console.error('Error generating custom report:', error);
    res.status(500).json({ error: 'Failed to generate custom report' });
  }
});

// Helper function to generate detailed report
async function generateDetailedReport(articles, topics, query = null) {
  let reportContent = `# Detailed AI in Medicine Report\n`;
  reportContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
  if (query) reportContent += `Search Query: "${query}"\n`;
  reportContent += `Total Articles: ${articles.length}\n\n`;

  const articlesByTopic = articles.reduce((acc, article) => {
    const topic = article.topic || 'general';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(article);
    return acc;
  }, {});

  for (const topic of topics) {
    const topicArticles = articlesByTopic[topic] || [];
    if (topicArticles.length > 0) {
      reportContent += `## ${topic.charAt(0).toUpperCase() + topic.slice(1)} (${topicArticles.length} articles)\n\n`;
      
      topicArticles.forEach((article, index) => {
        reportContent += `### ${index + 1}. ${article.title}\n\n`;
        reportContent += `**Source:** ${article.source}\n`;
        reportContent += `**Published:** ${new Date(article.publishedDate).toLocaleDateString()}\n`;
        reportContent += `**Link:** [Read more](${article.link})\n\n`;
        reportContent += `**Summary:** ${article.summary || article.description}\n\n`;
        reportContent += `---\n\n`;
      });
    }
  }

  return {
    report: reportContent,
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    topics: topics,
    type: 'detailed'
  };
}

// Helper function to generate executive report
async function generateExecutiveReport(articles, topics, query = null) {
  let reportContent = `# Executive Briefing: AI in Medicine\n`;
  reportContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
  if (query) reportContent += `Focus: "${query}"\n`;
  reportContent += `Total Articles Analyzed: ${articles.length}\n\n`;

  // Group by topic and identify key themes
  const articlesByTopic = articles.reduce((acc, article) => {
    const topic = article.topic || 'general';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(article);
    return acc;
  }, {});

  reportContent += `## Key Developments by Sector\n\n`;

  for (const topic of topics) {
    const topicArticles = articlesByTopic[topic] || [];
    if (topicArticles.length > 0) {
      reportContent += `### ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
      
      // Extract top 3 most significant articles
      const topArticles = topicArticles.slice(0, 3);
      topArticles.forEach((article, index) => {
        reportContent += `${index + 1}. **${article.title}**\n`;
        reportContent += `   ${article.summary || article.description}\n\n`;
      });
    }
  }

  reportContent += `## Strategic Implications\n\n`;
  reportContent += `Based on the analysis of ${articles.length} articles, the following strategic considerations emerge:\n\n`;
  reportContent += `- **Innovation Pace:** Rapid development in AI applications across medical specialties\n`;
  reportContent += `- **Clinical Integration:** Growing focus on practical implementation and validation\n`;
  reportContent += `- **Regulatory Landscape:** Evolving frameworks for AI medical device approval\n`;
  reportContent += `- **Market Trends:** Increased investment and partnerships in medical AI\n\n`;

  return {
    report: reportContent,
    generatedAt: new Date().toISOString(),
    totalArticles: articles.length,
    topics: topics,
    type: 'executive'
  };
}

module.exports = router;
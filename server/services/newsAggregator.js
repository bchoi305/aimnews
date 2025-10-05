const axios = require('axios');
const cheerio = require('cheerio');
const { subDays, format } = require('date-fns');

class NewsAggregator {
  constructor() {
    this.sources = {
      medicine: [
        {
          name: 'PubMed',
          baseUrl: 'https://pubmed.ncbi.nlm.nih.gov',
          searchUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=artificial+intelligence+medicine',
          selector: '.docsum-content'
        },
        {
          name: 'Medical News Today',
          baseUrl: 'https://www.medicalnewstoday.com',
          searchUrl: 'https://www.medicalnewstoday.com/search?q=artificial+intelligence+medicine',
          selector: '.css-1s7i3ps'
        }
      ],
      radiology: [
        {
          name: 'Radiology AI',
          baseUrl: 'https://www.radiologyai.com',
          searchUrl: 'https://www.radiologyai.com',
          selector: '.post-item'
        },
        {
          name: 'AuntMinnie',
          baseUrl: 'https://www.auntminnie.com',
          searchUrl: 'https://www.auntminnie.com/index.aspx?sec=ser&ser=AI',
          selector: '.headline-list-item'
        }
      ],
      cardiovascular: [
        {
          name: 'Journal of Cardiovascular MRI',
          baseUrl: 'https://www.jcmr-online.com',
          searchUrl: 'https://www.jcmr-online.com/search?query=artificial+intelligence',
          selector: '.c-listing__title'
        },
        {
          name: 'SCCT',
          baseUrl: 'https://www.scct.org',
          searchUrl: 'https://www.scct.org',
          selector: '.news-item'
        }
      ]
    };
  }

  async fetchFromSource(source, topic, daysBack = 7) {
    try {
      const response = await axios.get(source.searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const articles = [];

      $(source.selector).each((index, element) => {
        const $element = $(element);
        const title = $element.find('a, h1, h2, h3, h4').first().text().trim();
        const link = $element.find('a').first().attr('href');
        const description = $element.find('p, .summary, .excerpt').first().text().trim();
        
        if (title && link) {
          const fullLink = link.startsWith('http') ? link : `${source.baseUrl}${link}`;
          articles.push({
            title,
            link: fullLink,
            description,
            source: source.name,
            topic,
            publishedDate: new Date().toISOString(), // Would need to parse actual date from source
            id: `${source.name}-${index}-${Date.now()}`
          });
        }
      });

      return articles;
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error.message);
      return [];
    }
  }

  async aggregateNews(topics = ['medicine', 'radiology', 'cardiovascular'], daysBack = 7) {
    const allArticles = [];
    
    for (const topic of topics) {
      const sources = this.sources[topic] || [];
      
      for (const source of sources) {
        const articles = await this.fetchFromSource(source, topic, daysBack);
        allArticles.push(...articles);
      }
    }

    // Sort by publication date (newest first)
    return allArticles.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  }

  async getNewsByTopic(topic, daysBack = 7) {
    return this.aggregateNews([topic], daysBack);
  }

  async searchNews(query, topics = ['medicine', 'radiology', 'cardiovascular'], daysBack = 7) {
    // This would implement custom search logic
    // For now, return aggregated news filtered by query
    const allArticles = await this.aggregateNews(topics, daysBack);
    
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = NewsAggregator;
const OpenAI = require('openai');

class AISummarizer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarizeArticle(article) {
    try {
      const prompt = `Please provide a concise summary of the following article about AI in medicine/radiology/cardiovascular imaging:

Title: ${article.title}
Description: ${article.description}
Source: ${article.source}

Focus on the key findings, innovations, and implications for the medical field. Keep the summary to 2-3 sentences.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical AI expert who specializes in summarizing news and research about artificial intelligence in medicine, radiology, and cardiovascular imaging. Provide clear, concise summaries that highlight the most important developments."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.3,
      });

      return {
        ...article,
        summary: response.choices[0].message.content.trim(),
        summarizedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error summarizing article:', error);
      return {
        ...article,
        summary: article.description || 'Summary not available',
        summarizedAt: new Date().toISOString()
      };
    }
  }

  async summarizeMultipleArticles(articles) {
    const summarizedArticles = [];
    
    // Process articles in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      const batchPromises = batch.map(article => this.summarizeArticle(article));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        summarizedArticles.push(...batchResults);
        
        // Add delay between batches to respect rate limits
        if (i + batchSize < articles.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Error processing batch:', error);
        // Add original articles if summarization fails
        summarizedArticles.push(...batch);
      }
    }

    return summarizedArticles;
  }

  async generateWeeklyReport(articles, topics = ['medicine', 'radiology', 'cardiovascular']) {
    try {
      const articlesByTopic = articles.reduce((acc, article) => {
        const topic = article.topic || 'general';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(article);
        return acc;
      }, {});

      let reportContent = `# AI in Medicine Weekly Report\n`;
      reportContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

      for (const topic of topics) {
        const topicArticles = articlesByTopic[topic] || [];
        if (topicArticles.length > 0) {
          reportContent += `## ${topic.charAt(0).toUpperCase() + topic.slice(1)}\n\n`;
          
          const topicPrompt = `Based on these ${topicArticles.length} articles about AI in ${topic}, provide a 3-4 sentence overview of the key trends and developments this week:\n\n${topicArticles.map(a => `- ${a.title}: ${a.summary || a.description}`).join('\n')}`;
          
          const topicResponse = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a medical AI expert providing weekly insights on AI developments in medicine."
              },
              {
                role: "user",
                content: topicPrompt
              }
            ],
            max_tokens: 200,
            temperature: 0.3,
          });

          reportContent += `${topicResponse.choices[0].message.content.trim()}\n\n`;
          
          // Add top 3 articles for this topic
          const topArticles = topicArticles.slice(0, 3);
          reportContent += `### Key Articles:\n`;
          topArticles.forEach((article, index) => {
            reportContent += `${index + 1}. **${article.title}**\n`;
            reportContent += `   ${article.summary || article.description}\n`;
            reportContent += `   [Read more](${article.link})\n\n`;
          });
        }
      }

      // Add overall summary
      const overallPrompt = `Based on all ${articles.length} articles across medicine, radiology, and cardiovascular imaging, what are the 3 most significant AI developments this week? Provide a brief executive summary.`;
      
      const overallResponse = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a strategic analyst providing executive summaries of AI developments in healthcare."
          },
          {
            role: "user",
            content: overallPrompt
          }
        ],
        max_tokens: 250,
        temperature: 0.3,
      });

      reportContent += `## Executive Summary\n\n`;
      reportContent += `${overallResponse.choices[0].message.content.trim()}\n`;

      return {
        report: reportContent,
        generatedAt: new Date().toISOString(),
        totalArticles: articles.length,
        topics: topics
      };
    } catch (error) {
      console.error('Error generating weekly report:', error);
      throw new Error('Failed to generate weekly report');
    }
  }
}

module.exports = AISummarizer;
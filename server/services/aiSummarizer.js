const OpenAI = require('openai');

class AISummarizer {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.openai = this.apiKey && this.apiKey.startsWith('sk-') ? new OpenAI({
      apiKey: this.apiKey,
    }) : null;
  }

  async summarizeArticle(article) {
    // If OpenAI is not available, return a simple summary
    if (!this.openai) {
      return {
        ...article,
        summary: `AI-powered summary not available. Based on title: "${article.title}"`,
        summarizedAt: new Date().toISOString()
      };
    }

    try {
      // Use title as primary content since descriptions are empty
      const content = article.description || article.title;
      const prompt = `Please provide a concise summary of the following article about AI in medicine/radiology/cardiovascular imaging:

Title: ${article.title}
Content: ${content}
Source: ${article.source}

Based on the title and available information, provide a 2-3 sentence summary focusing on the key AI applications, innovations, or implications for the medical field.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a medical AI expert who specializes in summarizing news and research about artificial intelligence in medicine, radiology, and cardiovascular imaging. Provide clear, concise summaries that highlight the most important developments even when limited information is available."
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
        summary: `Summary based on title: "${article.title}"`,
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
          
          if (this.openai) {
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
          } else {
            reportContent += `This week, ${topicArticles.length} articles were found covering AI developments in ${topic}. Key areas include recent advancements in medical AI applications and research. For detailed AI-powered analysis, please configure a valid OpenAI API key.\n\n`;
          }
          
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
      if (this.openai) {
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
      } else {
        reportContent += `## Executive Summary\n\n`;
        reportContent += `This week's analysis covers ${articles.length} articles across AI in medicine, radiology, and cardiovascular imaging. The field continues to show rapid development with numerous research publications and clinical applications. For AI-powered insights and analysis, please configure a valid OpenAI API key in your environment variables.\n`;
      }

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
# AI Medicine News Reporter

A comprehensive web application that aggregates and summarizes news about AI in medicine, radiology, and cardiovascular MRI & CT. Generate customized reports with AI-powered insights to stay updated with the latest developments in medical AI.

## Features

- **News Aggregation**: Automatically collects news from multiple medical and AI sources
- **AI-Powered Summarization**: Uses OpenAI to generate concise summaries of articles
- **Customizable Reports**: Generate weekly, detailed, or executive reports
- **Topic Filtering**: Focus on specific areas (medicine, radiology, cardiovascular)
- **Time Range Selection**: Choose from 24 hours to 30 days of coverage
- **Search Functionality**: Find articles on specific topics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** for AI summarization
- **Cheerio** for web scraping
- **Axios** for HTTP requests
- **Date-fns** for date manipulation

### Frontend
- **React** with modern hooks
- **React Select** for dropdowns
- **React Markdown** for report display
- **Axios** for API calls
- **CSS Grid/Flexbox** for responsive layout

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aimnews
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```
   
   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Usage

### News Dashboard
1. Select topics you're interested in (medicine, radiology, cardiovascular)
2. Choose a time period (last 24 hours to last month)
3. Optionally enable AI summaries for concise overviews
4. Use the search bar to find specific topics
5. Click "Apply Filters" to update the news feed

### Report Generation
1. Navigate to the "Generate Reports" tab
2. Select your desired topics and time period
3. Choose a report type:
   - **Weekly Summary**: Concise overview of key developments
   - **Detailed Report**: Comprehensive analysis with all articles
   - **Executive Briefing**: Strategic insights for decision makers
4. Optionally add a search query to focus the report
5. Click "Generate Report" to create your customized report
6. Download the report as a Markdown file

## API Endpoints

### News
- `GET /api/news` - Get news by topics and time range
- `GET /api/news/topic/:topic` - Get news for specific topic
- `GET /api/news/search` - Search news articles
- `GET /api/news/topics` - Get available topics

### Reports
- `POST /api/reports/weekly` - Generate weekly summary report
- `POST /api/reports/custom` - Generate custom report

### Health
- `GET /api/health` - Health check endpoint

## Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `OPENAI_API_KEY`: OpenAI API key (required)
- `NEWS_API_KEY`: Optional additional news source API key
- `GUARDIAN_API_KEY`: Optional Guardian API key
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)
- `CACHE_TTL_SECONDS`: Cache duration (default: 1 hour)

### News Sources
The application aggregates news from:
- PubMed
- Medical News Today
- Radiology AI
- AuntMinnie
- Journal of Cardiovascular MRI
- SCCT

Additional sources can be added by modifying the `NewsAggregator` service.

## Development

### Project Structure
```
aimnews/
├── server/
│   ├── index.js              # Main server file
│   ├── routes/
│   │   ├── news.js           # News API routes
│   │   └── reports.js        # Reports API routes
│   └── services/
│       ├── newsAggregator.js # News aggregation logic
│       └── aiSummarizer.js   # AI summarization service
├── client/
│   ├── public/
│   │   └── index.html        # HTML template
│   └── src/
│       ├── components/
│       │   ├── Header.js
│       │   ├── NewsDashboard.js
│       │   ├── NewsFilters.js
│       │   ├── ArticleList.js
│       │   ├── ReportGenerator.js
│       │   └── LoadingSpinner.js
│       ├── App.js            # Main React component
│       ├── App.css           # Global styles
│       ├── index.js          # React entry point
│       └── index.css         # Base styles
├── package.json              # Root package configuration
└── README.md                 # This file
```

### Adding New News Sources
1. Update the `sources` object in `server/services/newsAggregator.js`
2. Add the source configuration with name, baseUrl, searchUrl, and selector
3. Test the new source by running the application

### Customizing Report Templates
Report templates are defined in `server/services/aiSummarizer.js`:
- `generateWeeklyReport()`: Standard weekly summary
- `generateDetailedReport()`: Comprehensive report format
- `generateExecutiveReport()`: Executive briefing format

## Deployment

### Production Build
1. Build the React application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment
A Dockerfile can be created to containerize the application for easy deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## Roadmap

- [ ] Add more news sources
- [ ] Implement user authentication
- [ ] Add email report delivery
- [ ] Create mobile app
- [ ] Add real-time notifications
- [ ] Implement advanced analytics
- [ ] Add multi-language support
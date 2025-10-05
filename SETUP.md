# Quick Setup Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
./start.sh
```
or manually:
```bash
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Run the Application
```bash
npm run dev
```

### 4. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🧪 Testing Without OpenAI API

The application works without an OpenAI API key for testing:
- News aggregation: ✅ Fully functional
- Report generation: ✅ Works with placeholder summaries
- AI summarization: ❌ Requires valid API key

## 📊 Verified Features

### Working Components
- ✅ News aggregation from PubMed
- ✅ Topic-based filtering (medicine, radiology, cardiovascular)
- ✅ Time range selection (24h to 30 days)
- ✅ Report generation (weekly, detailed, executive)
- ✅ Search functionality
- ✅ Responsive web interface
- ✅ Download reports as Markdown

### API Endpoints Tested
- ✅ `GET /api/health` - Health check
- ✅ `GET /api/news/topics` - Available topics
- ✅ `GET /api/news` - News aggregation
- ✅ `POST /api/reports/weekly` - Weekly reports

## 🔧 Common Issues

### Port Conflicts
If ports 3000 or 5000 are in use:
```bash
PORT=3001 npm run dev  # Backend on different port
```

### Node.js Compatibility
The app works with Node.js v18+. If you encounter undici errors, the package.json includes compatibility fixes.

### News Source Limitations
Some news sources may return 403 errors due to anti-bot measures. PubMed integration is fully functional.

## 📱 Usage Tips

1. **News Dashboard**: Start here to browse recent articles
2. **Report Generator**: Create customized weekly summaries
3. **Filters**: Use topic and time filters for focused content
4. **Search**: Find articles on specific AI applications
5. **Download**: Save reports as Markdown files

## 🎯 Next Steps

1. Add your OpenAI API key for AI-powered summaries
2. Explore different report types
3. Customize time ranges and topics
4. Set up automated weekly reports
5. Add additional news sources if needed

## 📞 Support

If you encounter issues:
1. Check the terminal output for error messages
2. Ensure all dependencies are installed
3. Verify your .env configuration
4. Check the README.md for detailed documentation

Enjoy your AI Medicine News Reporter! 🎉
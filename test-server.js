const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/news/topics', (req, res) => {
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

// Mock news endpoint for testing
app.get('/api/news', (req, res) => {
  const mockArticles = [
    {
      id: 'test-1',
      title: 'AI Breakthrough in Medical Diagnosis',
      description: 'New AI system shows promising results in early disease detection',
      source: 'Test Source',
      topic: 'medicine',
      publishedDate: new Date().toISOString(),
      link: 'https://example.com/article1'
    },
    {
      id: 'test-2',
      title: 'Machine Learning Improves Radiology Accuracy',
      description: 'Study shows 15% improvement in diagnostic accuracy with AI assistance',
      source: 'Test Source',
      topic: 'radiology',
      publishedDate: new Date().toISOString(),
      link: 'https://example.com/article2'
    }
  ];

  res.json({
    articles: mockArticles,
    total: mockArticles.length
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Topics: http://localhost:${PORT}/api/news/topics`);
  console.log(`News: http://localhost:${PORT}/api/news`);
});
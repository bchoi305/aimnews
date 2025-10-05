import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Select from 'react-select';

const ReportGenerator = ({ onError, setLoading }) => {
  const [selectedTopics, setSelectedTopics] = useState(['medicine', 'radiology', 'cardiovascular']);
  const [daysBack, setDaysBack] = useState(7);
  const [reportType, setReportType] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeSummaries, setIncludeSummaries] = useState(true);
  const [report, setReport] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const topicOptions = [
    { value: 'medicine', label: 'AI in Medicine' },
    { value: 'radiology', label: 'AI in Radiology' },
    { value: 'cardiovascular', label: 'AI in Cardiovascular MRI & CT' }
  ];

  const reportTypeOptions = [
    { value: 'summary', label: 'Weekly Summary', description: 'Concise overview of key developments' },
    { value: 'detailed', label: 'Detailed Report', description: 'Comprehensive analysis with all articles' },
    { value: 'executive', label: 'Executive Briefing', description: 'Strategic insights for decision makers' }
  ];

  const timeOptions = [
    { value: 1, label: 'Last 24 hours' },
    { value: 3, label: 'Last 3 days' },
    { value: 7, label: 'Last week' },
    { value: 14, label: 'Last 2 weeks' },
    { value: 30, label: 'Last month' }
  ];

  const handleTopicSelectChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedTopics(values);
  };

  const handleTimeSelectChange = (selectedOption) => {
    setDaysBack(selectedOption.value);
  };

  const handleReportTypeChange = (selectedOption) => {
    setReportType(selectedOption.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSummarizeChange = (e) => {
    setIncludeSummaries(e.target.checked);
  };

  const generateReport = async () => {
    if (selectedTopics.length === 0) {
      onError('Please select at least one topic');
      return;
    }

    setLoadingLocal(true);
    setLoading(true);
    setReport(null);

    try {
      const endpoint = reportType === 'summary' ? '/api/reports/weekly' : '/api/reports/custom';
      const payload = {
        topics: selectedTopics,
        daysBack,
        includeSummaries,
        reportType
      };

      if (searchQuery.trim()) {
        payload.query = searchQuery.trim();
      }

      const response = await axios.post(endpoint, payload);
      setReport(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
      const errorMessage = error.response?.data?.error || 'Failed to generate report';
      onError(errorMessage);
    } finally {
      setLoadingLocal(false);
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const blob = new Blob([report.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-medicine-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedTopics(['medicine', 'radiology', 'cardiovascular']);
    setDaysBack(7);
    setReportType('summary');
    setSearchQuery('');
    setIncludeSummaries(true);
    setReport(null);
  };

  return (
    <div className="report-generator">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Generate AI Medicine Report</h2>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Topics</label>
            <Select
              isMulti
              options={topicOptions}
              value={topicOptions.filter(option => selectedTopics.includes(option.value))}
              onChange={handleTopicSelectChange}
              placeholder="Select topics..."
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={loadingLocal}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Time Period</label>
            <Select
              options={timeOptions}
              value={timeOptions.find(option => option.value === daysBack)}
              onChange={handleTimeSelectChange}
              placeholder="Select time period..."
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={loadingLocal}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <Select
              options={reportTypeOptions}
              value={reportTypeOptions.find(option => option.value === reportType)}
              onChange={handleReportTypeChange}
              placeholder="Select report type..."
              className="react-select-container"
              classNamePrefix="react-select"
              isDisabled={loadingLocal}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Search (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Focus report on specific topic..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              disabled={loadingLocal}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={includeSummaries}
              onChange={handleSummarizeChange}
              disabled={loadingLocal}
            />
            {' '}Include AI-powered article summaries
          </label>
        </div>

        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={generateReport}
            disabled={loadingLocal || selectedTopics.length === 0}
          >
            {loadingLocal ? 'Generating...' : '📊 Generate Report'}
          </button>
          
          <button
            className="btn btn-outline"
            onClick={resetForm}
            disabled={loadingLocal}
          >
            Reset
          </button>
        </div>
      </div>

      {report && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Generated Report</h3>
            <div className="btn-group">
              <button
                className="btn btn-secondary"
                onClick={downloadReport}
              >
                📥 Download
              </button>
            </div>
          </div>
          
          <div className="report-meta mb-3">
            <p className="text-muted">
              Generated on: {new Date(report.generatedAt).toLocaleString()} | 
              Total articles: {report.totalArticles} | 
              Topics: {report.topics.join(', ')}
            </p>
          </div>
          
          <div className="report-container">
            <div className="report-content">
              <ReactMarkdown>{report.report}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .react-select-container {
          margin-bottom: 0;
        }
        
        .react-select__control {
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          min-height: 44px;
        }
        
        .react-select__control:hover {
          border-color: #667eea;
        }
        
        .react-select__control--is-focused {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .react-select__multi-value {
          background-color: #667eea;
          color: white;
        }
        
        .react-select__multi-value__label {
          color: white;
        }
        
        .react-select__multi-value__remove {
          color: white;
        }
        
        .react-select__multi-value__remove:hover {
          background-color: #764ba2;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ReportGenerator;
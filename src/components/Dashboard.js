import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from './Sidebar';
import VideoPlayer from './VideoPlayer';
import SearchBar from './SearchBar';
import AwsS3Client from '../utils/AwsS3Client';
import { parseCSV, searchTranscriptions, extractUniqueWords } from '../utils/csvParser';
import './Dashboard.css';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueWords, setUniqueWords] = useState([]);
  const [testingS3, setTestingS3] = useState(false);
  const [s3TestResult, setS3TestResult] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await parseCSV('/transcriptions.csv');
        setVideos(data);
        setFilteredVideos(data);
        
        // Extract unique words for auto-suggest
        const words = extractUniqueWords(data);
        setUniqueWords(words);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load video data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = (searchTerm) => {
    const results = searchTranscriptions(videos, searchTerm);
    setFilteredVideos(results);
    
    // If we have search results and no video is currently selected, select the first result
    if (results.length > 0 && !selectedVideo) {
      setSelectedVideo(results[0]);
    } else if (results.length === 0) {
      setSelectedVideo(null);
    }
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  const testS3Connection = async () => {
    setTestingS3(true);
    setS3TestResult(null);
    
    try {
      // Try to list objects in the bucket
      const items = await AwsS3Client.listObjects();
      setS3TestResult({
        success: true,
        message: `Success! Found ${items.length} items in the bucket.`,
        data: items
      });
    } catch (error) {
      setS3TestResult({
        success: false,
        message: `Error: ${error.message}`,
        error: error
      });
    } finally {
      setTestingS3(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Container fluid className="dashboard-container">
      <Row className="dashboard-header">
        <Col>
          <h1>Video Transcription Dashboard</h1>
          <SearchBar onSearch={handleSearch} uniqueWords={uniqueWords} />
        </Col>
      </Row>
      
      {/* S3 Test Button */}
      <Row className="s3-test-row">
        <Col>
          <Button 
            variant="info" 
            onClick={testS3Connection} 
            disabled={testingS3}
            className="s3-test-button"
          >
            {testingS3 ? 'Testing S3 Connection...' : 'Test S3 Connection'}
          </Button>
          
          {s3TestResult && (
            <div className={`s3-test-result ${s3TestResult.success ? 'success' : 'error'}`}>
              <p>{s3TestResult.message}</p>
              {s3TestResult.success && s3TestResult.data && s3TestResult.data.length > 0 && (
                <p>First item: {s3TestResult.data[0].Key}</p>
              )}
            </div>
          )}
        </Col>
      </Row>
      
      <Row className="dashboard-content">
        <Col md={3} className="sidebar-col">
          <Sidebar 
            videos={filteredVideos} 
            onSelectVideo={handleSelectVideo} 
            currentVideo={selectedVideo}
          />
        </Col>
        <Col md={9} className="video-col">
          <VideoPlayer video={selectedVideo} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 
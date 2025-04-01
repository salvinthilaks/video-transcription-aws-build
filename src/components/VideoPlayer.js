import React, { useState, useEffect } from "react";
import AwsS3Client from "../utils/AwsS3Client";
import "./VideoPlayer.css";

const VideoPlayer = ({ video, allVideos }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [videoLoadingProgress, setVideoLoadingProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  // Effect for loading video and keywords
  useEffect(() => {
    // Reset states
    setVideoUrl(null);
    setError(null);
    setDebugInfo(null);
    setKeywords([]);
    setRecommendedVideos([]);
    setVideoLoadingProgress(0);
    setVideoReady(false);

    if (!video || !video["Video Name"]) {
      return;
    }

    setLoading(true);

    // Function to load keywords from CSV
    const loadKeywords = async () => {
      try {
        const response = await fetch('/keywords.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const rows = csvText.split('\n');
        
        // Find the row for the current video
        const videoRow = rows.find(row => {
          const videoName = row.split(',')[0];
          return videoName === video["Video Name"];
        });

        if (videoRow) {
          const keywordsStr = videoRow.substring(videoRow.indexOf(',') + 1);
          try {
            const cleanedStr = keywordsStr
              .replace(/^['"]|['"]$/g, '')
              .replace(/^\[|\]$/g, '')
              .split(',')
              .map(k => k.trim())
              .map(k => k.replace(/^['"]|['"]$/g, ''))
              .filter(k => k.length > 0);
            
            setKeywords(cleanedStr);
          } catch (e) {
            console.error("Error parsing keywords:", e);
            setKeywords([]);
          }
        } else {
          setKeywords([]);
        }
      } catch (err) {
        console.error("Error fetching keywords:", err);
        setKeywords([]);
      }
    };

    // Function to load video
    const loadVideo = async () => {
      try {
        const url = AwsS3Client.getVideoUrl(video["Video Name"]);
        setVideoUrl(url);

        // Preload the video
        const videoElement = new Audio();
        videoElement.src = url;
        
        // Track loading progress
        videoElement.addEventListener('progress', () => {
          if (videoElement.buffered.length > 0) {
            const progress = (videoElement.buffered.end(videoElement.buffered.length - 1) / videoElement.duration) * 100;
            setVideoLoadingProgress(Math.min(progress, 100));
          }
        });

        // Handle video ready
        videoElement.addEventListener('canplaythrough', () => {
          setVideoReady(true);
          setVideoLoadingProgress(100);
        });

        // Handle errors
        videoElement.addEventListener('error', (e) => {
          console.error("Video loading error:", e);
          setError("Failed to load video. Please try again.");
        });

        setDebugInfo({ 
          videoName: video["Video Name"], 
          url: url, 
          transcriptLength: video.Transcript?.length || 0,
          timestamp: new Date().toISOString() 
        });

        // Find recommended videos from the same module
        if (allVideos) {
          const currentModule = video["Module"];
          const relatedVideos = allVideos.filter(v => 
            v["Module"] === currentModule && 
            v["Video Name"] !== video["Video Name"]
          ).slice(0, 4);
          setRecommendedVideos(relatedVideos);
        }
      } catch (err) {
        console.error("Error getting video URL:", err);
        setError("Failed to load video URL: " + err.message);
        setDebugInfo({ 
          videoName: video["Video Name"], 
          error: err.message, 
          stack: err.stack, 
          timestamp: new Date().toISOString() 
        });
      }
    };

    // Load both video and keywords
    Promise.all([loadVideo(), loadKeywords()])
      .finally(() => {
        setLoading(false);
      });
  }, [video, allVideos]);

  if (!video) {
    return (
      <div className="video-player-placeholder">
        <div className="placeholder-text">
          <h3>Select a video from the sidebar</h3>
          <p>Video preview will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <h2 className="video-title">{video["Video Name"]}</h2>
      <div className="video-container">
        {loading && (
          <div className="video-placeholder">
            <div className="loading-spinner"></div>
            <p>Loading video...</p>
            <div className="loading-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${videoLoadingProgress}%` }}
              ></div>
              <span>{Math.round(videoLoadingProgress)}%</span>
            </div>
          </div>
        )}
        {error && (
          <div className="video-placeholder video-error">
            <p>{error}</p>
            {debugInfo && (
              <details>
                <summary>Debug Info</summary>
                <pre className="debug-info">{JSON.stringify(debugInfo, null, 2)}</pre>
              </details>
            )}
          </div>
        )}
        {!loading && !error && (
          videoUrl ? (
            <video 
              controls 
              className={`video-element ${videoReady ? 'video-ready' : ''}`}
              src={videoUrl}
              crossOrigin="anonymous"
              preload="auto"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-placeholder">
              <p>Video: {video["Video Name"]}</p>
              <p>Unable to load video from S3</p>
              <p>Please check your S3 bucket configuration</p>
            </div>
          )
        )}
      </div>
      {keywords.length > 0 && (
        <div className="keywords-section">
          <h4>Keywords</h4>
          <div className="keywords-list">
            {keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
      {video.Transcript && (
        <div className="transcript-section">
          <h4>Transcript</h4>
          <div className="transcript-content">
            {video.Transcript.split(/[.!?]+/).map((sentence, index) => (
              <p key={index} className="transcript-sentence">
                {sentence.trim()}
              </p>
            ))}
          </div>
        </div>
      )}
      {recommendedVideos.length > 0 && (
        <div className="recommended-videos-section">
          <h4>Recommended Videos</h4>
          <div className="recommended-videos-grid">
            {recommendedVideos.map((recommendedVideo, index) => (
              <div key={index} className="recommended-video-card">
                <h5>{recommendedVideo["Video Name"]}</h5>
                <p className="video-description">{recommendedVideo["Description"]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

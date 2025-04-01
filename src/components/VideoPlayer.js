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

  // Effect for loading video and keywords
  useEffect(() => {
    // Reset states
    setVideoUrl(null);
    setError(null);
    setDebugInfo(null);
    setKeywords([]);
    setRecommendedVideos([]);

    if (!video || !video["Video Name"]) {
      return;
    }

    setLoading(true);

    // Function to load keywords from CSV
    const loadKeywords = async () => {
      try {
        console.log("Loading keywords for video:", video["Video Name"]);
        const response = await fetch('/keywords.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log("CSV content loaded:", csvText.substring(0, 200) + "...");
        
        const rows = csvText.split('\n');
        console.log("Total rows in CSV:", rows.length);
        
        // Find the row for the current video
        const videoRow = rows.find(row => {
          const videoName = row.split(',')[0];
          console.log("Comparing:", videoName, "with:", video["Video Name"]);
          return videoName === video["Video Name"];
        });

        if (videoRow) {
          console.log("Found matching row:", videoRow);
          // Get everything after the first comma as the keywords string
          const keywordsStr = videoRow.substring(videoRow.indexOf(',') + 1);
          try {
            // Clean up the keywords string
            const cleanedStr = keywordsStr
              .replace(/^['"]|['"]$/g, '') // Remove outer quotes
              .replace(/^\[|\]$/g, '')     // Remove square brackets
              .split(',')                   // Split by comma
              .map(k => k.trim())          // Trim whitespace
              .map(k => k.replace(/^['"]|['"]$/g, '')) // Remove inner quotes
              .filter(k => k.length > 0);  // Remove empty strings
            
            console.log("Processed keywords:", cleanedStr);
            setKeywords(cleanedStr);
          } catch (e) {
            console.error("Error parsing keywords string:", e);
            console.error("Problematic string:", keywordsStr);
            setKeywords([]);
          }
        } else {
          console.log("No matching row found for video:", video["Video Name"]);
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
        console.log("S3 video URL:", url);
        setVideoUrl(url);

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
          ).slice(0, 4); // Show up to 4 related videos
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
            <p>Loading video...</p>
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
              className="video-element" 
              src={videoUrl}
              crossOrigin="anonymous"
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

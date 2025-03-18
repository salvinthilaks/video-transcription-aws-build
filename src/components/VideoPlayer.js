import React, { useState, useEffect } from 'react';
import S3Service from '../utils/S3Service';
import './VideoPlayer.css';

const VideoPlayer = ({ video }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when video changes
    setVideoUrl(null);
    setError(null);
    
    if (video && video['Video Name']) {
      setLoading(true);
      
      // Fetch the video URL from S3
      S3Service.getSignedUrl(video['Video Name'])
        .then(url => {
          console.log('S3 video URL:', url); // Debug URL
          setVideoUrl(url);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching video URL:', err);
          setError('Failed to load video URL: ' + err.message);
          setLoading(false);
        });
    }
  }, [video]);

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
      <h2 className="video-title">{video['Video Name']}</h2>
      <div className="video-container">
        {loading && (
          <div className="video-placeholder">
            <p>Loading video...</p>
          </div>
        )}
        
        {error && (
          <div className="video-placeholder video-error">
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          videoUrl ? (
            <video 
              controls 
              className="video-element" 
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="video-placeholder">
              <p>Video: {video['Video Name']}</p>
              <p>S3 integration required to play this video</p>
              <p>(AWS credentials needed for actual playback)</p>
            </div>
          )
        )}
      </div>
      <div className="transcript-container">
        <h4>Transcript</h4>
        <p className="transcript-text">{video.Transcript}</p>
      </div>
    </div>
  );
};

export default VideoPlayer; 
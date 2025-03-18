import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = ({ videos, onSelectVideo, currentVideo }) => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Video List</h3>
      <ListGroup>
        {videos.map((video, index) => (
          <ListGroup.Item 
            key={index}
            active={currentVideo && currentVideo['Video Name'] === video['Video Name']}
            onClick={() => onSelectVideo(video)}
            className="sidebar-item"
          >
            {video['Video Name']}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar; 
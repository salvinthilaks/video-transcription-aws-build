import React from 'react';
import { ListGroup } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar = ({ videos, onSelectVideo, currentVideo }) => {
  // Group videos by module
  const groupByModule = (videos) => {
    const modules = {};
    
    videos.forEach(video => {
      // Extract module number from video name (e.g., "Mod01", "Mod02")
      const moduleName = video['Video Name'].match(/Mod(\d+)/i);
      
      if (moduleName) {
        const moduleNumber = moduleName[1];
        const moduleKey = `Module ${moduleNumber}`;
        
        if (!modules[moduleKey]) {
          modules[moduleKey] = [];
        }
        
        modules[moduleKey].push(video);
      } else {
        // For videos that don't match the module pattern
        if (!modules['Other']) {
          modules['Other'] = [];
        }
        modules['Other'].push(video);
      }
    });
    
    return modules;
  };
  
  const moduleGroups = groupByModule(videos);
  
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Course Modules</h3>
      
      {Object.keys(moduleGroups).sort().map(moduleKey => (
        <div key={moduleKey} className="module-group">
          <h4 className="module-title">{moduleKey}</h4>
          <ListGroup>
            {moduleGroups[moduleKey].map((video, index) => (
              <ListGroup.Item 
                key={`${moduleKey}-${index}`}
                active={currentVideo && currentVideo['Video Name'] === video['Video Name']}
                onClick={() => onSelectVideo(video)}
                className="sidebar-item"
              >
                {video['Video Name']}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ))}
    </div>
  );
};

export default Sidebar; 
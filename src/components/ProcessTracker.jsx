import { useEffect, useState } from 'react';

const ProcessTracker = ({ progress }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [startTime] = useState(Date.now());
  
  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const elapsedTime = Date.now() - startTime;
      const estimatedTotalTime = (elapsedTime / progress) * 100;
      const remainingTime = estimatedTotalTime - elapsedTime;
      
      // Format remaining time
      if (remainingTime < 1000) {
        setTimeRemaining('Almost done...');
      } else if (remainingTime < 60000) {
        setTimeRemaining(`${Math.ceil(remainingTime / 1000)} seconds remaining`);
      } else {
        setTimeRemaining(`${Math.ceil(remainingTime / 60000)} minutes remaining`);
      }
    } else if (progress >= 100) {
      setTimeRemaining('Complete!');
    }
  }, [progress, startTime]);
  
  // Define status message based on progress
  const getStatusMessage = () => {
    if (progress < 25) return 'Preparing images...';
    if (progress < 50) return 'Processing images...';
    if (progress < 75) return 'Creating PDF...';
    if (progress < 100) return 'Finalizing...';
    return 'Conversion complete!';
  };
  
  return (
    <div className="process-tracker">
      <h3>Converting Images to PDF</h3>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="progress-info">
          <span className="progress-percentage">{Math.round(progress)}%</span>
          {timeRemaining && <span className="time-remaining">{timeRemaining}</span>}
        </div>
      </div>
      
      <div className="status-message">
        <p>{getStatusMessage()}</p>
      </div>
    </div>
  );
};

export default ProcessTracker;
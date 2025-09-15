import { useState, useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

const ConversionOptions = ({ quality, setQuality, images }) => {
  const [estimatedSize, setEstimatedSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(1);
  
  // Calculate original size of all images
  const originalSize = images.reduce((total, img) => total + img.file.size, 0);
  
  // Estimate compressed size based on quality setting
  useEffect(() => {
    const qualityFactors = {
      low: 0.4,    // 60% reduction
      medium: 0.7, // 30% reduction
      high: 0.9,   // 10% reduction
    };
    
    const estimatedBytes = originalSize * qualityFactors[quality];
    setEstimatedSize(estimatedBytes);
    setCompressionRatio(originalSize / estimatedBytes);
  }, [quality, originalSize]);
  
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="conversion-options">
      <h3>Compression Options</h3>
      
      <div className="quality-selector">
        <label htmlFor="quality-select">Quality Setting:</label>
        <select 
          id="quality-select"
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          aria-label="Select compression quality"
        >
          <option value="low">Low (smaller file size)</option>
          <option value="medium">Medium (balanced)</option>
          <option value="high">High (better quality)</option>
        </select>
        
        <div className="tooltip">
          <FiInfo />
          <span className="tooltip-text">
            Lower quality results in smaller file size but may reduce image clarity
          </span>
        </div>
      </div>
      
      <div className="size-estimation">
        <div className="estimation-row">
          <span>Original Size:</span>
          <span>{formatSize(originalSize)}</span>
        </div>
        <div className="estimation-row">
          <span>Estimated Size:</span>
          <span>{formatSize(estimatedSize)}</span>
        </div>
        <div className="estimation-row">
          <span>Compression Ratio:</span>
          <span>{compressionRatio.toFixed(1)}x</span>
        </div>
        <div className="size-reduction">
          <div className="reduction-bar">
            <div 
              className="reduction-indicator" 
              style={{ width: `${(1 - 1/compressionRatio) * 100}%` }}
            ></div>
          </div>
          <span>{Math.round((1 - 1/compressionRatio) * 100)}% reduction</span>
        </div>
      </div>
    </div>
  );
};

export default ConversionOptions;
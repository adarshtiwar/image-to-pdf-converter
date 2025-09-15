import { useState } from 'react';
import { saveAs } from 'file-saver';
import { FiDownload, FiShare2, FiEdit } from 'react-icons/fi';

const OutputSection = ({ pdfBlob, metadata, setMetadata }) => {
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [tempMetadata, setTempMetadata] = useState({ ...metadata });
  
  const handleDownload = () => {
    const filename = `${metadata.title.replace(/\s+/g, '_')}.pdf`;
    saveAs(pdfBlob, filename);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        const file = new File([pdfBlob], `${metadata.title}.pdf`, { type: 'application/pdf' });
        await navigator.share({
          title: metadata.title,
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = URL.createObjectURL(pdfBlob);
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.setAttribute('download', `${metadata.title}.pdf`);
        tempLink.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
    }
  };
  
  const handleMetadataSubmit = (e) => {
    e.preventDefault();
    setMetadata(tempMetadata);
    setIsEditingMetadata(false);
  };
  
  return (
    <div className="output-section">
      <h3>Your PDF is Ready!</h3>
      
      {isEditingMetadata ? (
        <form onSubmit={handleMetadataSubmit} className="metadata-form">
          <div className="form-group">
            <label htmlFor="pdf-title">Title:</label>
            <input
              type="text"
              id="pdf-title"
              value={tempMetadata.title}
              onChange={(e) => setTempMetadata({ ...tempMetadata, title: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pdf-author">Author:</label>
            <input
              type="text"
              id="pdf-author"
              value={tempMetadata.author}
              onChange={(e) => setTempMetadata({ ...tempMetadata, author: e.target.value })}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="primary-button">Save Metadata</button>
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => setIsEditingMetadata(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="pdf-info">
          <div className="pdf-metadata">
            <p><strong>Title:</strong> {metadata.title}</p>
            <p><strong>Author:</strong> {metadata.author}</p>
            <p><strong>Created:</strong> {new Date(metadata.creationDate).toLocaleString()}</p>
            <button 
              onClick={() => setIsEditingMetadata(true)} 
              className="icon-button"
              aria-label="Edit PDF metadata"
            >
              <FiEdit /> Edit Metadata
            </button>
          </div>
          
          <div className="pdf-actions">
            <button 
              onClick={handleDownload} 
              className="primary-button"
              aria-label="Download PDF"
            >
              <FiDownload /> Download PDF
            </button>
            
            <button 
              onClick={handleShare} 
              className="secondary-button"
              aria-label="Share PDF"
            >
              <FiShare2 /> Share
            </button>
          </div>
        </div>
      )}
      
      <div className="pdf-preview">
        <iframe 
          src={URL.createObjectURL(pdfBlob)} 
          title="PDF Preview" 
          className="pdf-iframe"
        />
      </div>
    </div>
  );
};

export default OutputSection;
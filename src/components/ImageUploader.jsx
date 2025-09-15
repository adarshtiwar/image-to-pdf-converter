import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FiUpload } from 'react-icons/fi';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const ImageUploader = ({ setImages }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = [];
      const invalidFiles = [];

      acceptedFiles.forEach((file) => {
        // Check file type
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          invalidFiles.push({ file, reason: 'Invalid file type' });
          return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push({ file, reason: 'File too large (max 10MB)' });
          return;
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onload = () => {
          validFiles.push({
            file,
            preview: reader.result,
            id: `${file.name}-${Date.now()}`,
          });

          // If this is the last file, update state
          if (validFiles.length + invalidFiles.length === acceptedFiles.length) {
            setImages((prevImages) => [...prevImages, ...validFiles]);
            
            // Show error messages for invalid files
            invalidFiles.forEach(({ file, reason }) => {
              toast.error(`${file.name}: ${reason}`);
            });
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
    multiple: true,
  });

  return (
    <div className="image-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        aria-label="Drop zone for image uploads"
        role="button"
        tabIndex="0"
      >
        <input {...getInputProps()} aria-label="File upload input" />
        <div className="upload-icon">
          <FiUpload size={48} />
        </div>
        <h3>Drag & Drop Images Here</h3>
        <p>Or click to select files</p>
        <p className="file-types">Supported formats: JPG, PNG, GIF, WEBP</p>
        <p className="file-size">Maximum file size: 10MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;
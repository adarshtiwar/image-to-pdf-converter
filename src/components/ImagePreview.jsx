import { FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const ImagePreview = ({ images, setImages }) => {
  const removeImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const moveImage = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newImages[index];
    newImages[index] = newImages[newIndex];
    newImages[newIndex] = temp;
    setImages(newImages);
  };

  return (
    <div className="image-preview">
      <h3>Image Preview</h3>
      <p>{images.length} image(s) selected</p>
      <div className="thumbnails-container">
        {images.map((image, index) => (
          <div key={image.id} className="thumbnail-item">
            <div className="thumbnail-image">
              <img src={image.preview} alt={`Preview ${index + 1}`} />
            </div>
            <div className="thumbnail-info">
              <p className="thumbnail-name" title={image.file.name}>
                {image.file.name.length > 20
                  ? `${image.file.name.substring(0, 17)}...`
                  : image.file.name}
              </p>
              <p className="thumbnail-size">
                {(image.file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="thumbnail-actions">
              <button
                onClick={() => moveImage(index, 'up')}
                disabled={index === 0}
                aria-label="Move image up"
                className="move-button"
              >
                <FiArrowUp />
              </button>
              <button
                onClick={() => moveImage(index, 'down')}
                disabled={index === images.length - 1}
                aria-label="Move image down"
                className="move-button"
              >
                <FiArrowDown />
              </button>
              <button
                onClick={() => removeImage(image.id)}
                aria-label="Remove image"
                className="remove-button"
              >
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePreview;
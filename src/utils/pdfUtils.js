import { PDFDocument } from 'pdf-lib';

/**
 * Converts an array of image objects to a PDF blob
 * @param {Array} images - Array of image objects with preview data URLs
 * @param {string} quality - Quality setting ('low', 'medium', 'high')
 * @param {Object} metadata - PDF metadata (title, author, etc.)
 * @param {Function} onProgress - Callback function for progress updates
 * @returns {Promise<Blob>} - PDF blob
 */
export const convertImagesToPdf = async (images, quality, metadata, onProgress) => {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Set PDF metadata
    pdfDoc.setTitle(metadata.title || 'Converted PDF');
    pdfDoc.setAuthor(metadata.author || 'Image to PDF Converter');
    pdfDoc.setCreationDate(new Date(metadata.creationDate || Date.now()));
    
    // Quality factors for compression
    const qualityFactors = {
      low: 0.4,
      medium: 0.7,
      high: 0.9,
    };
    
    const compressionFactor = qualityFactors[quality] || qualityFactors.medium;
    
    // Process each image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBytes = await fetchImageAsBytes(image.preview);
      
      // Determine image type and embed accordingly
      let pdfImage;
      if (image.file.type === 'image/jpeg' || image.file.type === 'image/jpg') {
        pdfImage = await pdfDoc.embedJpg(imageBytes);
      } else if (image.file.type === 'image/png') {
        pdfImage = await pdfDoc.embedPng(imageBytes);
      } else {
        // For other formats (GIF, WEBP), convert to PNG first
        const pngBytes = await convertToPng(image.preview);
        pdfImage = await pdfDoc.embedPng(pngBytes);
      }
      
      // Add a new page with the image dimensions
      const imageDimensions = pdfImage.scale(compressionFactor);
      const page = pdfDoc.addPage([imageDimensions.width, imageDimensions.height]);
      
      // Draw the image on the page
      page.drawImage(pdfImage, {
        x: 0,
        y: 0,
        width: imageDimensions.width,
        height: imageDimensions.height,
      });
      
      // Update progress
      onProgress(Math.round(((i + 1) / images.length) * 100));
    }
    
    // Save the PDF as bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convert to Blob
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    throw error;
  }
};

/**
 * Fetches an image from a data URL and returns it as bytes
 * @param {string} dataUrl - Data URL of the image
 * @returns {Promise<Uint8Array>} - Image bytes
 */
const fetchImageAsBytes = async (dataUrl) => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Convert blob to array buffer
    return new Uint8Array(await blob.arrayBuffer());
  } catch (error) {
    console.error('Error fetching image as bytes:', error);
    throw error;
  }
};

/**
 * Converts an image to PNG format
 * @param {string} dataUrl - Data URL of the image
 * @returns {Promise<Uint8Array>} - PNG image bytes
 */
const convertToPng = async (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(async (blob) => {
        try {
          const arrayBuffer = await blob.arrayBuffer();
          resolve(new Uint8Array(arrayBuffer));
        } catch (error) {
          reject(error);
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for conversion'));
    };
    
    img.src = dataUrl;
  });
};
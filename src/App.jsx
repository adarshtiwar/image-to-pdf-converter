import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Components
import ImageUploader from './components/ImageUploader'
import ImagePreview from './components/ImagePreview'
import ConversionOptions from './components/ConversionOptions'
import ProcessTracker from './components/ProcessTracker'
import OutputSection from './components/OutputSection'

// Utils
import { convertImagesToPdf } from './utils/pdfUtils'

function App() {
  const [images, setImages] = useState([])
  const [quality, setQuality] = useState('medium')
  const [progress, setProgress] = useState(0)
  const [converting, setConverting] = useState(false)
  const [pdfBlob, setPdfBlob] = useState(null)
  const [metadata, setMetadata] = useState({
    title: 'Converted PDF',
    author: 'Image to PDF Converter',
    creationDate: new Date().toISOString(),
  })

  const handleConversion = async () => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setConverting(true);
      setProgress(0);
      setPdfBlob(null);

      // Start conversion process
      toast.info('Starting PDF conversion...');
      
      const result = await convertImagesToPdf(
        images,
        quality,
        metadata,
        (progressValue) => setProgress(progressValue)
      );

      setPdfBlob(result);
      toast.success('PDF created successfully!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(`Error creating PDF: ${error.message}`);
    } finally {
      setConverting(false);
      setProgress(100);
    }
  }

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header>
        <h1>Image to PDF Converter</h1>
        <p>Convert your images to PDF with ease</p>
      </header>
      <main>
        <div className="converter-container">
          <section className="upload-section">
            <ImageUploader setImages={setImages} />
          </section>
          
          {images.length > 0 && (
            <>
              <section className="preview-section">
                <ImagePreview images={images} setImages={setImages} />
              </section>
              
              <section className="options-section">
                <ConversionOptions 
                  quality={quality} 
                  setQuality={setQuality} 
                  images={images}
                />
                
                <div className="conversion-actions">
                  <button 
                    className="convert-button" 
                    onClick={handleConversion}
                    disabled={converting || images.length === 0}
                    aria-label="Convert images to PDF"
                  >
                    {converting ? 'Converting...' : 'Convert to PDF'}
                  </button>
                </div>
              </section>
              
              {converting && (
                <section className="progress-section">
                  <ProcessTracker progress={progress} />
                </section>
              )}
              
              {pdfBlob && (
                <section className="output-section">
                  <OutputSection 
                    pdfBlob={pdfBlob} 
                    metadata={metadata}
                    setMetadata={setMetadata}
                  />
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Image to PDF Converter by Adarsh Tiwari</p>
      </footer>
    </div>
  )
}

export default App

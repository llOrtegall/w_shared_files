import { Upload, Check, Copy, CheckCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function UploadPage() {
  const [downloadLink, setDownloadLink] = useState('');
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setDownloadLink(res.data.shareLink);
    } catch (error) {
      console.error("Error uploading", error);
      alert('Error al subir el archivo');
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(downloadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Resetear el icono a los 2 seg
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <div className="app-container">

      {!downloadLink ? (
        // VISTA 1: FORMULARIO DE SUBIDA
        <div
          {...getRootProps()}
          className={`upload-card ${isDragActive ? 'drag-active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-icon"><Upload size={24} /></div>
          <h2>Upload files</h2>
          <p className="main-text">Drag and drop or click to upload</p>
          <p className="sub-text">Accepts files between 1.00KB and 10.00MB.</p>
        </div>
      ) : (
        // VISTA 2: LINK GENERADO (Diseño mejorado)
        <div className="upload-card">
          <div style={{ marginBottom: '20px' }}>
            <CheckCircle size={48} color="#22c55e" style={{ margin: '0 auto' }} />
          </div>

          <h2 style={{ marginBottom: '5px' }}>¡Archivo listo!</h2>
          <p className="sub-text" style={{ marginBottom: '25px' }}>Comparte este enlace para descargar</p>

          {/* Input con el link y botón de copiar pegado */}
          <div style={{
            display: 'flex',
            background: '#18181b',
            padding: '5px',
            borderRadius: '8px',
            border: '1px solid #27272a',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={downloadLink}
              readOnly
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a1a1aa',
                flex: 1,
                padding: '10px',
                outline: 'none',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={copyToClipboard}
              style={{
                background: copied ? '#22c55e' : 'white',
                color: copied ? 'white' : 'black',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <button
            onClick={() => setDownloadLink('')}
            style={{ marginTop: '25px', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
          >
            Subir otro archivo
          </button>
        </div>
      )}

    </div>
  );
}
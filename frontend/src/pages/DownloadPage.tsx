import { Download, File, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function DownloadPage() {
  const { id } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/file-info/${id}`);
        setFileData(res.data);
      } catch (err) {
        setError('El archivo no existe o ya expiró.');
      } finally {
        setLoading(false);
      }
    };
    fetchFileInfo();
  }, [id]);

  const handleDownload = () => {
    if (!id) return;
    const downloadEndpoint = `http://localhost:5000/api/download-content/${id}`;

    const link = document.createElement('a');
    link.href = downloadEndpoint;
    link.setAttribute('download', fileData?.originalName || 'archivo');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div style={{ color: 'white', display: 'flex', gap: '10px', alignItems: 'center' }}>
      <Loader2 className="animate-spin" /> Cargando info...
    </div>
  );

  if (error) return (
    <div className="app-container">
      <div className="upload-card" style={{ borderColor: '#ef4444' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 10px' }} />
        <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>

        {/* Botón de regreso en caso de error */}
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid white' }}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="upload-card">

        <p className="sub-text" style={{ marginBottom: '20px' }}>Alguien te ha enviado un archivo</p>

        <div style={{ background: '#18181b', borderRadius: '50%', padding: '20px', display: 'inline-block', marginBottom: '20px' }}>
          <File size={40} color="white" />
        </div>

        <h2 style={{ wordBreak: 'break-all', fontSize: '1.2rem', marginBottom: '5px' }}>
          {fileData.originalName}
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#71717a', fontSize: '0.9rem', marginBottom: '30px' }}>
          <span>{(fileData.size / 1024 / 1024).toFixed(2)} MB</span>
          <span>•</span>
          <span>{new Date(fileData.uploadDate).toLocaleDateString()}</span>
        </div>

        <button
          onClick={handleDownload}
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            transition: 'transform 0.1s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <Download size={20} />
          Descargar Ahora
        </button>

        {/* --- NUEVA SECCIÓN: PIE DE PÁGINA CON LINK AL HOME --- */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #27272a' }}>
          <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '8px' }}>
            ¿Tú también quieres enviar archivos?
          </p>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            Envía tus propios archivos aquí <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
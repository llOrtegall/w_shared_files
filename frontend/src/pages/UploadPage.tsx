import { useDropzone, type DropEvent, type FileRejection } from 'react-dropzone';
import { Check, Copy, CheckCircle } from 'lucide-react';
import MyIcon from "../assets/UploadIcon.svg";
import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (downloadLink !== null) {
      navigator.clipboard.writeText(downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Resetear el icono a los 2 seg
    }
  };

  const handleLoadFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post<string>('/upload', formData)
      .then((res) => {
        if(res.status === 200 && typeof res.data === 'string'){
          setDownloadLink(res.data)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onDrop = (acceptedFiles: File[], _fileRejections: FileRejection[], _event: DropEvent) => {
    if (acceptedFiles.length > 0 && acceptedFiles.length < 2) {
      const newFile = acceptedFiles[0];
      handleLoadFile(newFile)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ maxFiles: 1, maxSize: 1048576, onDrop });

  return (
    <main className="bg-linear-to-t from-green-1 to-green-2 text-gray-200 h-screen w-full flex items-center justify-center">

      <section className=''>
        {
          !downloadLink ? (
            <article
              className={`bg-green-3 rounded-full h-96 w-96 flex cursor-pointer items-center justify-center border-test border border-dashed border-green-4 ${isDragActive ? 'bg-green-900 ' : ''}`}
            >
              <section {...getRootProps()} className="flex flex-col items-center space-y-1.75" >
                <input {...getInputProps()} type='file' />
                <figure className=''>
                  <img src={MyIcon} width={55} />
                </figure>
                <h2 className='font-imb-600 text-[16px]'>Upload File</h2>
                <p className="font-imb-400 text-[12px] text-gray-1 font-normal">Drag and drop or click to upload</p>
                <p className="font-imb-400 text-[10px] text-gray-2">Max Upload: 1GB</p>
              </section>
            </article>
          ) : (<article className="bg-green-3 rounded-full h-96 w-96 flex flex-col space-y-2
            items-center justify-center border-test border border-green-4 hover:bg-green-2">
            <figure>
              <CheckCircle size={48} color="#22c55e" />
            </figure>

            <h2 className='font-imb-600'>File Ready!</h2>
            <p>Share this link to download</p>

            {/* Input con el link y botón de copiar pegado */}
            <div className='flex items-center w-10/12 gap-1 px-2 py-1 rounded-md text-[#AAAAAA] font-imb-400 bg-green-1'>
              <input
                type="text"
                value={downloadLink !== null ? downloadLink : ''}
                readOnly
                className='text-sm text-ellipsis flex-1'
              />
              <button onClick={copyToClipboard} className='right-6 cursor-pointer hover:bg-gray-800 p-0.5 rounded-md'>
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <button
              onClick={() => setDownloadLink('')}
              className='font-imb-400 text-[#666666] hover:font-imb-400 cursor-pointer hover:underline'
            >
              Upload Again
            </button>
          </article>)
        }
      </section>
    </main>
  );
}
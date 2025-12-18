import { useDropzone } from 'react-dropzone';
import MyIcon from '../../assets/UploadIcon.svg';
import type { UploadProgress } from '../../hooks/useFileUpload';
import UploadProgressComponent from './UploadProgress';

type UploadZoneProps = {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  progress: UploadProgress | null;
};

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

export default function UploadZone({ onFileSelect, isUploading = false, progress }: UploadZoneProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    onDrop,
    disabled: isUploading,
  });

  return (
    isUploading && progress ? (

      <article className='bg-green-3 rounded-full h-96 w-96 pt-10 flex cursor-pointer items-center justify-center border border-dashed border-green-4 transition-colors'>
        <UploadProgressComponent
          percentage={progress.percentage}
          uploadedBytes={progress.uploadedBytes}
          totalBytes={progress.totalBytes}
          speed={progress.speed}
          estimatedTimeRemaining={progress.estimatedTimeRemaining}
        />
      </article>

    ) : (

      <article
        {...getRootProps()}
        className={`bg-green-3 rounded-full h-96 w-96 flex cursor-pointer items-center justify-center border border-dashed border-green-4 transition-colors ${isDragActive ? 'bg-green-900' : ''
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <section className="flex flex-col items-center space-y-1.75">
          <input {...getInputProps()} type="file" />

          <figure>
            <img src={MyIcon} width={55} alt="Upload icon" />
          </figure>

          <h2 className="font-imb-600 text-[16px] text-gray-1">
            <p>Click or Drag to Upload</p>
          </h2>
          <p className="font-imb-400 text-[10px] text-gray-2">Max Upload: 1GB</p>

        </section>
      </article>
    )
  );
}

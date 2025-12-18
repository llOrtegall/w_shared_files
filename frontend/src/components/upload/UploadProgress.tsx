import { ThreeDot } from "react-loading-indicators";

type UploadProgressProps = {
  percentage: number;
  uploadedBytes: number;
  totalBytes: number;
  speed: number; // bytes por segundo
  estimatedTimeRemaining: number; // segundos
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function formatTime(seconds: number): string {
  if (seconds === Infinity || isNaN(seconds)) return 'Calculando...';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}

export default function UploadProgress({
  percentage,
  uploadedBytes,
  totalBytes,
  speed,
  estimatedTimeRemaining,
}: UploadProgressProps) {
  return (
    <div className="w-full items-center justify-center px-16 space-y-2">
    
      <figure className="flex w-full items-center justify-center">
        <ThreeDot color="#1FDD7E" size="medium" text="" textColor="" />
      </figure>

      {/* Barra de progreso */}
      <div className="flex flex-col gap-1 pt-2">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-imb-400 text-primary text-center">
          {percentage}%
        </span>
      </div>

      {/* Información detallada */}
      <div className="flex flex-col text-center">
        <div className="text-[10px]">
          <p className="text-gray-200">Subido</p>
          <p className="font-imb-400 text-gray-300">
            {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
          </p>
        </div>

        <div className="text-[10px]">
          <p className="text-gray-200">Velocidad</p>
          <p className="font-imb-400 text-gray-300">{formatBytes(speed)}/s</p>
        </div>

        <div className="text-[10px]">
          <p className="text-gray-200">Tiempo restante</p>
          <p className="font-imb-400 text-gray-300">
            {formatTime(estimatedTimeRemaining)}
          </p>
        </div>
      </div>
    </div>
  );
}

import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react';
import type { CameraSource } from './CameraSelector';

interface WebcamFeedProps {
  cameraSource: CameraSource;
  onError?: (error: string) => void;
}

const WebcamFeed = forwardRef<HTMLVideoElement, WebcamFeedProps>(
  ({ cameraSource, onError }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(ref, () => videoRef.current!);

    useEffect(() => {
      let mounted = true;
      let loadingTimeout: NodeJS.Timeout;
      setIsReady(false);

      const startCamera = async () => {
        try {
          // Stop previous stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
              track.stop();
              console.log('🛑 Stopped track:', track.label);
            });
            streamRef.current = null;
          }

          if (!videoRef.current || !mounted) return;

          // Small delay to prevent flickering
          await new Promise(resolve => { loadingTimeout = setTimeout(resolve, 150); });

          if (cameraSource.type === 'webcam') {
            // Standard webcam via getUserMedia
            const constraints: MediaStreamConstraints = {
              video: cameraSource.deviceId
                ? { deviceId: { exact: cameraSource.deviceId } }
                : {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: 'user'
                  },
              audio: false
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (!mounted) {
              stream.getTracks().forEach(track => track.stop());
              return;
            }

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            
            // Wait for video to be ready
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(() => {
                setIsReady(true);
                console.log('✅ Webcam connected:', cameraSource.label);
              });
            };

          } else if (cameraSource.type === 'ip-camera') {
            // IP Camera via URL
            if (!cameraSource.url) {
              throw new Error('IP camera URL is required');
            }

            // For IP cameras, set the URL directly
            videoRef.current.src = cameraSource.url;
            videoRef.current.crossOrigin = 'anonymous';
            
            // Add error handling for IP camera
            videoRef.current.onerror = () => {
              const errorMsg = 'Не удалось подключиться к IP камере. Проверьте URL и доступность камеры.';
              console.error(errorMsg);
              onError?.(errorMsg);
            };

            // Wait for video to be ready
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(() => {
                setIsReady(true);
                console.log('✅ IP Camera connected:', cameraSource.url);
              });
            };
          }

        } catch (error: any) {
          console.error('❌ Camera error:', error);
          
          let errorMsg = 'Ошибка подключения к камере';
          if (error.name === 'NotAllowedError') {
            errorMsg = 'Доступ к камере запрещен. Разрешите доступ в настройках браузера.';
          } else if (error.name === 'NotFoundError') {
            errorMsg = 'Камера не найдена. Проверьте подключение устройства.';
          } else if (error.name === 'NotReadableError') {
            errorMsg = 'Камера занята другим приложением.';
          } else if (error.message) {
            errorMsg = error.message;
          }

          onError?.(errorMsg);
        }
      };

      startCamera();

      return () => {
        mounted = false;
        clearTimeout(loadingTimeout);
        setIsReady(false);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.stop();
            console.log('🛑 Cleanup track:', track.label);
          });
          streamRef.current = null;
        }
        
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.srcObject = null;
          videoRef.current.src = '';
          videoRef.current.onloadedmetadata = null;
          videoRef.current.onerror = null;
        }
      };
    }, [cameraSource]);

    return (
      <>
        <video
          ref={videoRef}
          className="webcam-feed absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
          playsInline
          muted
        />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-jarvis-dark">
            <div className="text-glow text-sm">Подключение к камере...</div>
          </div>
        )}
      </>
    );
  }
);

WebcamFeed.displayName = 'WebcamFeed';

export default WebcamFeed;

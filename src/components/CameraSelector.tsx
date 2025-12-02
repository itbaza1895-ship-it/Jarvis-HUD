import { useEffect, useState } from 'react';
import { Camera, Wifi, Monitor } from 'lucide-react';

interface CameraSelectorProps {
  onCameraSelect: (source: CameraSource) => void;
  currentSource: CameraSource;
}

export interface CameraSource {
  type: 'webcam' | 'ip-camera';
  deviceId?: string;
  url?: string;
  label?: string;
}

export default function CameraSelector({ onCameraSelect, currentSource }: CameraSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [showIpInput, setShowIpInput] = useState(false);
  const [ipUrl, setIpUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
    }
  };

  const handleWebcamSelect = (deviceId: string, label: string) => {
    onCameraSelect({
      type: 'webcam',
      deviceId,
      label
    });
    setIsOpen(false);
  };

  const handleIpCameraSubmit = () => {
    if (!ipUrl.trim()) return;
    
    onCameraSelect({
      type: 'ip-camera',
      url: ipUrl.trim(),
      label: 'IP Camera'
    });
    setShowIpInput(false);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-20 right-8 z-20">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hud-panel px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-jarvis-strong transition-all pointer-events-auto"
      >
        <Camera className="w-4 h-4 text-glow" />
        <span className="text-glow text-xs">
          {currentSource.label || 'Выбрать камеру'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 hud-panel rounded-lg p-4 space-y-3 pointer-events-auto max-h-96 overflow-y-auto hud-scrollbar">
          {/* Header */}
          <div className="border-b border-jarvis-cyan/30 pb-2">
            <span className="text-glow-strong text-sm font-bold">ИСТОЧНИК ВИДЕО</span>
          </div>

          {/* Webcams */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-glow text-xs">
              <Monitor className="w-3 h-3" />
              <span>Веб-камеры</span>
            </div>
            
            {devices.length === 0 ? (
              <div className="text-glow text-xs opacity-70 pl-5">
                Нет доступных камер
              </div>
            ) : (
              devices.map((device, index) => (
                <button
                  key={device.deviceId}
                  onClick={() => handleWebcamSelect(device.deviceId, device.label || `Camera ${index + 1}`)}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                    currentSource.deviceId === device.deviceId
                      ? 'bg-jarvis-cyan/20 border border-jarvis-cyan/50 text-glow-strong'
                      : 'bg-jarvis-dark/50 border border-jarvis-cyan/20 text-glow hover:bg-jarvis-cyan/10'
                  }`}
                >
                  {device.label || `Камера ${index + 1}`}
                </button>
              ))
            )}
          </div>

          {/* IP Camera */}
          <div className="space-y-2 border-t border-jarvis-cyan/30 pt-3">
            <div className="flex items-center gap-2 text-glow text-xs">
              <Wifi className="w-3 h-3" />
              <span>WiFi / IP камера</span>
            </div>

            {!showIpInput ? (
              <button
                onClick={() => setShowIpInput(true)}
                className="w-full px-3 py-2 rounded text-xs bg-jarvis-dark/50 border border-jarvis-cyan/20 text-glow hover:bg-jarvis-cyan/10 transition-all"
              >
                + Добавить IP камеру
              </button>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={ipUrl}
                  onChange={(e) => setIpUrl(e.target.value)}
                  placeholder="http://192.168.1.100:8080/video"
                  className="w-full px-3 py-2 rounded text-xs bg-jarvis-dark/70 border border-jarvis-cyan/30 text-glow placeholder-glow/50 focus:outline-none focus:border-jarvis-cyan focus:shadow-jarvis"
                  onKeyPress={(e) => e.key === 'Enter' && handleIpCameraSubmit()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleIpCameraSubmit}
                    className="flex-1 px-3 py-2 rounded text-xs bg-jarvis-cyan/20 border border-jarvis-cyan/50 text-glow-strong hover:bg-jarvis-cyan/30 transition-all"
                  >
                    Подключить
                  </button>
                  <button
                    onClick={() => {
                      setShowIpInput(false);
                      setIpUrl('');
                    }}
                    className="flex-1 px-3 py-2 rounded text-xs bg-jarvis-dark/50 border border-jarvis-cyan/20 text-glow hover:bg-jarvis-cyan/10 transition-all"
                  >
                    Отмена
                  </button>
                </div>
                <div className="text-glow text-[10px] opacity-70 space-y-1">
                  <div>Примеры URL:</div>
                  <div>• http://192.168.1.100:8080/video</div>
                  <div>• rtsp://admin:pass@192.168.1.100/stream</div>
                  <div>• http://camera.local/mjpeg</div>
                </div>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadDevices}
            className="w-full px-3 py-2 rounded text-xs bg-jarvis-dark/50 border border-jarvis-cyan/20 text-glow hover:bg-jarvis-cyan/10 transition-all"
          >
            🔄 Обновить список
          </button>
        </div>
      )}
    </div>
  );
}

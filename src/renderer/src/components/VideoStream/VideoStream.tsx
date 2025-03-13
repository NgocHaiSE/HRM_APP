import React, { useEffect, useState } from 'react';
import './VideoStream.css';
import IconButton from '../IconButton/IconButton';
import Play from '../../assets/icon/play.png';
import Stop from '../../assets/icon/stop.png';

interface Props {
  id: number;
  host: string;
}

const VideoStream: React.FC<Props> = ({ id, host }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const [isZmqActive, setIsZmqActive] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra trạng thái ban đầu của ZMQ
    window.api.isZmqActive(id, (active: boolean) => setIsZmqActive(active));

    // Khởi động ZMQ subscriber
    window.api.startZMQ(id, host);

    const handleImageFrame = (frame: { id: number; data: string }) => {
      if (frame.id === id) {
        setImageData(`data:image/jpeg;base64,${frame.data}`);
      }
    };

    const cleanupListener = (window as any).api.onImageFrame(handleImageFrame);

    return () => {
      cleanupListener(); // Gỡ listener khi unmount hoặc dependency thay đổi
      window.api.stopZMQ(id);
    };
  }, [id, host]);

  const toggleZmq = () => {
    if (isZmqActive) {
      window.api.stopZMQ(id);
      setIsZmqActive(false);
    } else {
      window.api.startZMQ(id, host);
      setIsZmqActive(true);
    }
  };

  return (
    <div
      className="video-stream"
      onMouseEnter={() => setShowToolbar(true)}
      onMouseLeave={() => setShowToolbar(false)}
    >
      {imageData ? (
        <img src={imageData} alt={`Frame for ID ${id}`} style={{ width: '100%', height: 'auto' }} />
      ) : (
        <p>Loading frame...</p>
      )}
      <div className={`tool ${showToolbar ? 'visible' : ''}`}>
        <IconButton icon={isZmqActive ? Stop : Play} onClick={toggleZmq} />
      </div>
    </div>
  );
};

export default VideoStream;
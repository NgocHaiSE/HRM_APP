import { useEffect, useState } from 'react';
import IconButton from '@renderer/components/IconButton/IconButton';
import Select from '../../components/Select/Select';
import './Monitor.css';
// import Next from '../../assets/icon/angle-right.png';
// import Back from '../../assets/icon/angle-left.png';
// import Add from '../../assets/icon/plus.png';
import VideoStream from '../../components/VideoStream/VideoStream';

const options = [
  { value: '1', label: '1x1' },
  { value: '4', label: '2x2' },
  { value: '6', label: '3x2' },
];

const Monitor = () => {
  const [selectedValue, setSelectedValue] = useState('1');
  const [cameraList, setCameraList] = useState<Camera[]>([]);

  useEffect(() => {
    window.db.getCameraList()
      .then((cameras: Camera[]) => {
        setCameraList(cameras);
      })
      .catch((error) => {
        console.error('Error fetching camera list:', error);
      });
  }, []);

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const renderGrid = () => {
    const gridSize = parseInt(selectedValue, 10);
    const streams: JSX.Element[] = [];
    const maxCameras = Math.min(gridSize, cameraList.length || 1);
    for (let i = 0; i < maxCameras; i++) {
      const camera = cameraList[i] || {
        id: i + 1,
        link: 'localhost',
        name: 'Default Camera',
        type: '0',
        ip: '127.0.0.1',
        status: 0,
        location: 'Unknown',
      };
      streams.push(<VideoStream key={camera["id"]} id={camera["id"]} host='localhost' />);
    }
    return streams;
  };

  const getGridClass = () => {
    switch (selectedValue) {
      case '1':
        return 'grid-1x1';
      case '4':
        return 'grid-2x2';
      case '6':
        return 'grid-3x2';
      default:
        return 'grid-1x1';
    }
  };

  return (
    <div className="monitor-container">
      <div className="streaming-section">
        <div className="toolbar">
          <div className="left-toolbar">
            <Select
              options={options}
              style={{ width: '70px', height: '35px', borderRadius: '10px' }}
              value={selectedValue}
              onChange={handleChange}
            />
            {/* <IconButton icon={Add} onClick={() => window.app.openNewWindow()} />
            <IconButton icon={Back} onClick={() => null} />
            <IconButton icon={Next} onClick={() => null} /> */}
          </div>
        </div>
        <div className={`grid-layout ${getGridClass()}`}>
          {renderGrid()}
        </div>
      </div>

    </div>
  );
};

export default Monitor;

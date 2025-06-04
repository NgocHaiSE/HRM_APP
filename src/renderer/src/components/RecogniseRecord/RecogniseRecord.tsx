import React from 'react';
import './RecogniseRecord.css';
import { SERVER_URL } from '@renderer/Api';

interface RecogniseRecordProps {
  fullName: string;
  code: string;
  location: string;
  timestamp: string;
  image: string;
}

const RecogniseRecord: React.FC<RecogniseRecordProps> = ({ fullName, code, location, timestamp, image }) => {
  // Determine if the person is a stranger
  let nameStyle: React.CSSProperties = {};
  if (fullName === 'Người lạ') {
    nameStyle = { color: 'red' };
  } else {
    nameStyle = { color: 'inherit' };
  }

  return (
    <div className="record-card">
      <img
        src={`${SERVER_URL}/recognise/${image}`}
        alt={fullName}
        className="record-image"
      />
      <div className="record-details">
        <h3 style={nameStyle}>{fullName}</h3>
        <p><strong>Mã NV:</strong> {code}</p>
        <p><strong>Vị trí:</strong> {location}</p>
        <p><strong>Thời gian:</strong> {timestamp}</p>
      </div>
    </div>
  );
};

export default RecogniseRecord;
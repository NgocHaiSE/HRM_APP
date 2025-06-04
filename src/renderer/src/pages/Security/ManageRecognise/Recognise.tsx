import React, { useEffect, useState } from 'react';
import RecogniseRecord from '@renderer/components/RecogniseRecord/RecogniseRecord';
import { SERVER_URL } from '@renderer/Api';
import './Recognise.css';

interface Record {
  fullName: string;
  code: string;
  location: string;
  timestamp: string;
  image: string;
}

const Recognise: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/timekeeping/recognitions`);
      const data = await response.json();
      console.log(data);

      // Map API response to match the expected props
      const mappedRecords = data.map((item: any) => ({
        fullName: item.fullname,
        code: item.personcode,
        location: item.location,
        timestamp: item.time,
        image: item.image,
      }));

      // Limit to 20 records (in case the API changes in the future)
      setRecords(mappedRecords.slice(0, 10));
    } catch (error) {
      console.error("Failed to fetch recognitions:", error);
    }
  };

  useEffect(() => {
    fetchRecords(); // Fetch initially
    const interval = setInterval(fetchRecords, 2000); // Fetch every 1 second
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px' }}>Lịch sử nhận diện</h2>
      <div className="record-grid">
        {records.length > 0 ? (
          records.map((record, index) => (
            <RecogniseRecord key={index} {...record} />
          ))
        ) : (
          <p>Không có dữ liệu nhận diện nào.</p>
        )}
      </div>
    </div>
  );
};

export default Recognise;
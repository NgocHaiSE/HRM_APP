import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Button2 from '../../components/Button/Button'

const ManageCam = () => {

  const Base_URL = 'http://localhost:8000';
  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState<Camera[]>([]);

  useEffect(() => {
    window.db.getCameraList()
      .then((cameras: Camera[]) => {
        setList(cameras);
      })
      .catch((error) => {
        console.error('Error fetching camera list:', error);
      });
  }, []);

  return (
    <div>

      <Button2
        onClick={() => null} 
        style={{ marginRight: '10px' }}
      >
        Thêm Camera
      </Button2>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader sx={{ minWidth: 800 }} aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 200 }}>
                  Tên Camera
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Đường dẫn
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Vị trí
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 200 }}
                >
                  Địa chỉ IP
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((camera) => (
                <TableRow
                  key={camera.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{camera.name}</TableCell>
                  <TableCell align="left">{camera.link}</TableCell>
                  <TableCell align="left">{camera.location}</TableCell>
                  <TableCell align="left">{camera.ip}</TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: '#D62525',
                          fontSize: '14px',
                          padding: '4px 8px',
                          minWidth: '70px',
                        }}
                      >
                        Xóa
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          fontSize: '14px',
                          padding: '4px 10px',
                          minWidth: '60px',
                        }}
                      // onClick={() => handleDetailClick(person)}
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default ManageCam
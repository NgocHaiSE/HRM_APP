import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Modal,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Search from '../../assets/icon/search.png';

const Base_URL = 'http://localhost:8000';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const TimekeepingHistory = () => {
  const location = useLocation();
  const [list, setList] = useState<TimekeepingHistory[]>([]);
  const [filteredList, setFilteredList] = useState<TimekeepingHistory[]>([]);
  const [page, setPage] = useState<number>(location.state?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.db.getAllTimekeepingHistory()
      .then((records: TimekeepingHistory[]) => {
        setList(records);
        setFilteredList(records);
        const maxPage = Math.max(0, Math.floor((records.length - 1) / rowsPerPage));
        if (page > maxPage) {
          setPage(maxPage);
        }
      })
      .catch((error) => {
        console.error('Error fetching data list:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${
        (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      }/${selectedDate.getFullYear()}`;

      const filtered = list.filter(record => 
        record.time.includes(formattedDate)
      );
      setFilteredList(filtered);
      setPage(0);
    } else {
      setFilteredList(list);
    }
  }, [selectedDate, list]);

  const paginatedRows = filteredList.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateClear = () => {
    setSelectedDate(null);
  };

  const handleOpenImageModal = (filename: string) => {
    // Giả sử mỗi record có một trường chứa tên file ảnh (ví dụ: image_path)
    const imageUrl = `${Base_URL}/timekeeping/${filename}`;
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="title">
        <h1>Lịch sử điểm danh</h1>
        <div className="search-and-date-filter" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
            id="search"
            variant="outlined"
            label="Tìm kiếm"
            placeholder="Nhập thông tin nhân viên..."
            sx={{ flex: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={Search} alt="search" style={{ width: 24, height: 24 }} />
                </InputAdornment>
              ),
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { variant: 'outlined' } }}
                sx={{ width: 200 }}
              />
              {selectedDate && (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleDateClear}
                >
                  Xóa
                </Button>
              )}
            </div>
          </LocalizationProvider>
        </div>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader sx={{ minWidth: 800 }} aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 200 }}>
                  Họ tên
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Mã nhân viên
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Cấp bậc
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 200 }}
                >
                  Vị trí
                </TableCell>
                <TableCell
                  align="left"
                  style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
                >
                  Thời gian
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
              {paginatedRows.map((record) => (
                <TableRow
                  key={record.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {record.avatar_path ? (
                        <img
                          src={`${Base_URL}/avatar/${record.avatar_path}`}
                          alt={`${record.fullname}'s avatar`}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          display: record.avatar_path ? 'none' : 'flex',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: '#e0e0e0',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          color: '#666',
                        }}
                      >
                        {record.fullname.charAt(0)}
                      </div>
                      <span>{record.fullname}</span>
                    </div>
                  </TableCell>
                  <TableCell align="left">{record.personcode}</TableCell>
                  <TableCell align="left">{record.rank}</TableCell>
                  <TableCell align="left">{record.location}</TableCell>
                  <TableCell align="left">{record.time}</TableCell>
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
                          fontSize: '14px',
                          padding: '4px 10px',
                          minWidth: '60px',
                        }}
                        onClick={() => handleOpenImageModal(record.image_url || 'default.jpg')} // Giả sử có trường image_path
                      >
                        Ảnh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={filteredList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Số hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal hiển thị ảnh */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Timekeeping Image"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.alt = 'Không thể tải ảnh';
              }}
            />
          ) : (
            <p>Không có ảnh để hiển thị</p>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default TimekeepingHistory;
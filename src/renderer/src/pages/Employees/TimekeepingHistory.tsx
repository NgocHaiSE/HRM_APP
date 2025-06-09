import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '@renderer/Api';
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
  TextField,
  InputAdornment,
  Modal,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomButton from '@renderer/components/Button/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import Search from '../../assets/icon/search.png';

function getStatusChip(status: string) {
  switch (status) {
    case 'PRESENT':
      return <Chip label="Đúng giờ" color="success" size="small" />;
    case 'LATE':
      return <Chip label="Đi muộn" color="error" size="small" />;
    case 'LEFT_EARLY':
      return <Chip label="Về sớm" color="warning" size="small" />;
    case 'NOT':
      return <Chip label="Chưa đến" color="default" size="small" />;
    case 'ON_LEAVE':
      return <Chip label="Nghỉ phép" color="info" size="small" />;
    case 'OVERTIME':
      return <Chip label="Làm thêm" color="secondary" size="small" />;
    default:
      return <Chip label={status} color="default" size="small" />;
  }
}

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



const TimekeepingHistory: React.FC = () => {
  const location = useLocation();
  const [list, setList] = useState<AttRecord[]>([]);
  const [filteredList, setFilteredList] = useState<AttRecord[]>([]);
  const [page, setPage] = useState<number>(location.state?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!selectedDate) return;
    try {
      const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
      const response = await fetch(`${SERVER_URL}/api/timekeeping/attendance/${formattedDate}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      const data: AttRecord[] = await response.json();
      setList(data);
      setFilteredList(data);
      const maxPage = Math.max(0, Math.floor((data.length - 1) / rowsPerPage));
      if (page > maxPage) {
        setPage(maxPage);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra cấu hình CSP hoặc server.');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [selectedDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [selectedDate]);

  const paginatedRows = filteredList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateClear = () => {
    setSelectedDate(null);
  };

  const handleOpenImageModal = (photo: string | null) => {
    if (!photo) return;
    // Có thể cần tùy chỉnh path nếu backend trả về path tương đối hoặc chỉ là filename
    const imageUrl = photo.startsWith('http') ? photo : `${SERVER_URL}/image/${photo}`;
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  return (
    <div>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      <div className="title">
        <Typography variant="h4" gutterBottom>
          Lịch sử chấm công
        </Typography>
        <div className="search-and-date-filter" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <TextField
            id="search"
            variant="outlined"
            label="Tìm kiếm"
            placeholder="Nhập tên, mã NV, phòng ban..."
            sx={{ flex: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* <img src={Search} alt="search" style={{ width: 24, height: 24 }} /> */}
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              const searchValue = e.target.value.toLowerCase();
              const filtered = list.filter((record) =>
                record.personCode.toLowerCase().includes(searchValue) ||
                record.personName.toLowerCase().includes(searchValue) ||
                (record.department?.toLowerCase() || '').includes(searchValue)
              );
              setFilteredList(filtered);
              setPage(0);
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
                <CustomButton
                  size={40}
                  onClick={handleDateClear}
                >
                  Xóa
                </CustomButton>
              )}
            </div>
          </LocalizationProvider>
        </div>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader sx={{ minWidth: 1000 }} aria-label="sticky table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#f3f6f9',
                  '& th': {
                    color: '#262e3e',
                    fontWeight: 'bold',
                    fontSize: '17px',
                    borderBottom: '2px solid #d8dee9',
                    letterSpacing: 1,
                  },
                  boxShadow: '0 2px 6px 0 rgba(60, 60, 60, 0.07)',
                }}
              >
                <TableCell align="center">STT</TableCell>
                <TableCell align="left">Họ tên</TableCell>
                <TableCell align="left">Mã NV</TableCell>
                <TableCell align="left">Phòng ban</TableCell>
                <TableCell align="center">Ngày</TableCell>
                <TableCell align="center">Check-in</TableCell>
                <TableCell align="center">Check-out</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Tổng phút</TableCell>
                <TableCell align="center">Ảnh</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((record, idx) => (
                <TableRow
                  key={record.id || idx}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: '#a88dca',  // màu xanh nhạt khi hover
                      cursor: 'pointer',
                    },
                    transition: 'background 0.18s',
                  }}
                >
                  <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell align="left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {record.avatarPath ? (
                        <img
                          src={`${SERVER_URL}/avatar/${record.avatarPath}`}
                          alt={`${record.personName}'s avatar`}
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
                          display: record.avatarPath ? 'none' : 'flex',
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
                        {record.personName.charAt(0)}
                      </div>
                      <span>{record.personName}</span>
                    </div>
                  </TableCell>
                  <TableCell align="left">{record.personCode}</TableCell>
                  <TableCell align="left">{record.department}</TableCell>
                  <TableCell align="center">{record.date}</TableCell>
                  <TableCell align="center">{record.checkIn || 'Chưa đến'}</TableCell>
                  <TableCell align="center">{record.checkOut || 'Chưa về'}</TableCell>
                  <TableCell align="center">{getStatusChip(record.status)}</TableCell>
                  <TableCell align="center">{record.totalWorkMin ?? ''}</TableCell>
                  <TableCell align="center">
                    {record.photo && (
                      <CustomButton
                        radius={5}
                        size={35}
                        onClick={() => handleOpenImageModal(record.photo)}
                      >
                        Xem ảnh
                      </CustomButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={11}
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

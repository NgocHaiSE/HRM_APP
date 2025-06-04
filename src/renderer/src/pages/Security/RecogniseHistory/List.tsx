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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SERVER_URL } from '@renderer/Api';

const List = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [list, setList] = useState<TimekeepingRecord[]>([]);
  const [page, setPage] = useState<number>(location.state?.page || 0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/timekeeping/get`);
        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
        }
        const data = await response.json();
        setList(data);
        // Tính lại maxPage và cập nhật page nếu cần
        const maxPage = Math.max(0, Math.floor((data.length - 1) / rowsPerPage));
        if (page > maxPage) {
          setPage(maxPage);
        }
      } catch (err) {
        console.error('Error fetching timekeeping data:', err);
      }
    };
    fetchData();
  }, []);

  const handleVideoClick = () => {
    return null
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
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
                Ngày
              </TableCell>
              <TableCell
                align="center"
                style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
              >
                Checkin
              </TableCell>
              <TableCell
                align="center"
                style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
              >
                Checkout
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((record) => (
              <TableRow
                key={record.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">{record.fullname}</TableCell>
                <TableCell align="left">{record.personcode}</TableCell>
                <TableCell align="left">{record.date}</TableCell>
                <TableCell align="center">{record.checkin_time}</TableCell>
                <TableCell align="center">{record.checkout_time}</TableCell>
                {/* <TableCell align="center">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <Button onClick={handleVideoClick}>Xem video </Button>
                  </div>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={7} // Số cột trong bảng
                count={list.length} // Tổng số hàng
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
  )
}

export default List
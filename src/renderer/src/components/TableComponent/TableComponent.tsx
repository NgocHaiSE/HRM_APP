import React, { useEffect, useState } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';

const Base_URL = 'http://localhost:8000';

const TableComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [list, setList] = useState<Person[]>([]);
    const [page, setPage] = useState<number>(location.state?.page || 0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    window.db.getPersonList()
      .then((persons: Person[]) => {
        setList(persons);
        const maxPage = Math.max(0, Math.floor((persons.length - 1) / rowsPerPage));
        if (page > maxPage) {
          setPage(maxPage);
        }
      })
      .catch((error) => {
        console.error('Error fetching person list:', error);
      });
  }, []);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDetailClick = (person: Person) => {
    navigate(`/detail`, { state: { person, page } });
  }

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
                style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 200 }}
              >
                Địa chỉ
              </TableCell>
              <TableCell
                align="left"
                style={{ fontSize: '16px', fontWeight: 'bold', minWidth: 150 }}
              >
                Số điện thoại
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
            {paginatedRows.map((person) => (
              <TableRow
                key={person.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {person.avatarPath ? (
                      <img
                        src={`${Base_URL}/avatar/${person.avatarPath}`}
                        alt={`${person.fullname}'s avatar`}
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
                        display: person.avatarPath ? 'none' : 'flex',
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
                      {person.fullname.charAt(0)}
                    </div>
                    <span>{person.fullname}</span>
                  </div>
                </TableCell>
                <TableCell align="left">{person.code}</TableCell>
                <TableCell align="left">{person.address}</TableCell>
                <TableCell align="left">{person.phone}</TableCell>
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
                      onClick={() => handleDetailClick(person)}
                    >
                      Chi tiết
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
                colSpan={5} // Số cột trong bảng
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
  );
};

export default TableComponent;
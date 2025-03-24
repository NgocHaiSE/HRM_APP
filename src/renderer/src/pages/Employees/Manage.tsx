import { TextField, InputAdornment } from '@mui/material';
import './Manage.css';
import Search from '../../assets/icon/search.png';
import TableComponent from '../../components/TableComponent/TableComponent';
import Button from "../../components/Button/Button"; 
import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';

const Manage = () => {
  const navigate = useNavigate()

  const handleAddClick = () => {
    navigate(`/employee/add`);
  }

  return (
    <div >
      <div className="title">
        <h1>Quản lý danh sách nhân viên</h1>
        <div className="search">
          <TextField
            id="search"
            variant="outlined"
            label="Tìm kiếm"
            placeholder="Nhập thông tin nhân viên..."
            sx={{ width: '100%' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={Search} alt="search" style={{ width: 24, height: 24 }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div className='toolbar'>
        {/* <label style={{fontSize: '16px', fontWeight: 'Bold'}}>Tổng số: </label> */}
        <Button onClick={handleAddClick}>Thêm nhân viên</Button>
        <Button onClick={() => null} style={{marginLeft: '10px', marginRight: '10px'}}>Xuất danh sách</Button>
      </div>
      <div>
        <TableComponent />
      </div>
    </div>

  );
};

export default Manage;
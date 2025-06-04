import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./Leave.css";

const leaveTypes = [
  { value: "", label: "-- Chọn loại nghỉ --" },
  { value: "annual", label: "Nghỉ phép năm" },
  { value: "sick", label: "Nghỉ ốm" },
  { value: "unpaid", label: "Nghỉ không lương" },
  // thêm loại khác nếu cần
];

const substituteUsers = [
  { value: "", label: "-- Chọn người thay thế --" },
  { value: "nv002", label: "Nguyễn Thị B" },
  { value: "nv003", label: "Trần Văn C" },
  // thêm nếu cần
];

export default function Leave() {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(new Date());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");
  const [substitute, setSubstitute] = useState("");
  // Giả lập dữ liệu ngày phép
  const remaining = 12, used = 8, total = 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API gửi đơn
    alert("Đơn nghỉ phép đã được gửi!");
  };

  return (
    <Paper className="leave-form-root" elevation={0}>
      <Box display="flex" alignItems="center" mb={3} gap={1}>
        <img alt="" src="/icons/leave-request.png" style={{ width: 30 }} />
        <Typography variant="h5" color="#533afc" fontWeight={700}>
          Đăng ký Nghỉ phép
        </Typography>
      </Box>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={4}>
          <Paper className="leave-form-stat" elevation={0}>
            <Typography className="leave-form-stat-num" color="#3a47e6">{remaining}</Typography>
            <Typography className="leave-form-stat-label">NGÀY CÒN LẠI</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className="leave-form-stat" elevation={0}>
            <Typography className="leave-form-stat-num" color="#f49b26">{used}</Typography>
            <Typography className="leave-form-stat-label">ĐÃ SỬ DỤNG</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className="leave-form-stat" elevation={0}>
            <Typography className="leave-form-stat-num" color="#36c1e0">{total}</Typography>
            <Typography className="leave-form-stat-label">TỔNG PHÉP NĂM</Typography>
          </Paper>
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="leave-type-label">Loại nghỉ phép</InputLabel>
          <Select
            labelId="leave-type-label"
            value={leaveType}
            label="Loại nghỉ phép"
            onChange={e => setLeaveType(e.target.value)}
            required
          >
            {leaveTypes.map(type => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" gap={2} my={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Từ ngày"
              value={fromDate}
              onChange={setFromDate}
              format="dd - MMM - yyyy"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Đến ngày"
              value={toDate}
              onChange={setToDate}
              format="dd - MMM - yyyy"
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          label="Lý do nghỉ"
          placeholder="Nhập lý do chi tiết..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="substitute-label">Người thay thế (tùy chọn)</InputLabel>
          <Select
            labelId="substitute-label"
            value={substitute}
            label="Người thay thế (tùy chọn)"
            onChange={e => setSubstitute(e.target.value)}
          >
            {substituteUsers.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
          <Button type="button" variant="outlined" color="inherit">
            Lưu nháp
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ background: "#533afc" }}>
            Gửi đơn
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

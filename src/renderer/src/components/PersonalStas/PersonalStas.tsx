import React, { useEffect, useState } from "react";
import { Calendar, TrendingUp, Clock, UserCheck, UserX, Coffee, Home } from "lucide-react";
import "./PersonalStas.css";
import { SERVER_URL } from "@renderer/Api";

interface PersonalStatsProps {
  personId: number;
}

interface StatsData {
  total: number;
  present: number;
  muon: number;
  left_early: number;
  on_leave: number;
  absent: number;
  overtime: number;
}

export default function PersonalStats({ personId }: PersonalStatsProps) {
  const [mode, setMode] = useState<"month" | "year" | "custom">("month");
  const [month, setMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [start, setStart] = useState<string>(
    new Date().toISOString().slice(0, 8) + "01"
  );
  const [end, setEnd] = useState<string>(new Date().toISOString().slice(0, 10));
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    present: 0,
    muon: 0,
    left_early: 0,
    on_leave: 0,
    absent: 0,
    overtime: 0,
  });

  // Cập nhật start, end khi đổi chế độ/mốc thời gian
  useEffect(() => {
    let s = "", e = "";
    if (mode === "month" && month) {
      const [yearVal, monthVal] = month.split('-');
      s = `${yearVal}-${monthVal}-01`;
      const lastDay = new Date(parseInt(yearVal), parseInt(monthVal), 0).getDate();
      e = `${yearVal}-${monthVal}-${lastDay.toString().padStart(2, '0')}`;
    } else if (mode === "year") {
      s = `${year}-01-01`;
      e = `${year}-12-31`;
    } else if (mode === "custom") {
      s = start;
      e = end;
    }
    setStart(s);
    setEnd(e);
  }, [mode, month, year, start, end]);

  useEffect(() => {
    if (!personId || !start || !end) return;
    
    // Mock data - thay thế bằng fetch thực tế
    // const mockStats = {
    //   total: 22,
    //   present: 18,
    //   muon: 3,
    //   left_early: 2,
    //   on_leave: 2,
    //   absent: 1,
    //   overtime: 5
    // };
    
    // Uncomment dòng dưới để sử dụng API thực
    
    fetch(`${SERVER_URL}/api/timekeeping/attendance/stats/${personId}?start=${start}&end=${end}`)
      .then(res => res.json())
      .then(data => setStats(data || {}))
      .catch(err => console.error('Error fetching stats:', err));
    
    
  }, [personId, start, end]);

  const handleModeChange = (newMode: "month" | "year" | "custom") => {
    setMode(newMode);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(e.target.value));
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
  };

  return (
    <div className="personal-stats-container">
      <div className="stats-header">
        <div className="header-title">
          <TrendingUp className="header-icon" />
          <h2>Thống kê cá nhân</h2>
        </div>
        
        <div className="filter-controls">
          <div className="mode-buttons">
            <button
              className={`mode-btn ${mode === "month" ? "active" : ""}`}
              onClick={() => handleModeChange("month")}
            >
              Tháng
            </button>
            <button
              className={`mode-btn ${mode === "year" ? "active" : ""}`}
              onClick={() => handleModeChange("year")}
            >
              Năm
            </button>
            <button
              className={`mode-btn ${mode === "custom" ? "active" : ""}`}
              onClick={() => handleModeChange("custom")}
            >
              Khoảng ngày
            </button>
          </div>

          <div className="date-controls">
            {mode === "month" && (
              <div className="date-input-group">
                <Calendar className="input-icon" />
                <input
                  type="month"
                  value={month}
                  onChange={handleMonthChange}
                  className="date-input"
                />
              </div>
            )}
            
            {mode === "year" && (
              <div className="date-input-group">
                <Calendar className="input-icon" />
                <input
                  type="number"
                  value={year}
                  onChange={handleYearChange}
                  min="2020"
                  max="2030"
                  className="date-input year-input"
                  placeholder="Năm"
                />
              </div>
            )}
            
            {mode === "custom" && (
              <div className="custom-date-group">
                <div className="date-input-group">
                  <input
                    type="date"
                    value={start}
                    onChange={handleStartChange}
                    className="date-input"
                  />
                </div>
                <span className="date-separator">đến</span>
                <div className="date-input-group">
                  <input
                    type="date"
                    value={end}
                    onChange={handleEndChange}
                    className="date-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card present">
          <div className="stat-icon">
            <UserCheck />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.present || 0}</div>
            <div className="stat-label">Đi làm</div>
          </div>
        </div>

        <div className="stat-card late">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.muon || 0}</div>
            <div className="stat-label">Đi muộn</div>
          </div>
        </div>

        <div className="stat-card early">
          <div className="stat-icon">
            <Home />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.left_early || 0}</div>
            <div className="stat-label">Về sớm</div>
          </div>
        </div>

        <div className="stat-card leave">
          <div className="stat-icon">
            <Coffee />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.on_leave || 0}</div>
            <div className="stat-label">Nghỉ phép</div>
          </div>
        </div>

        <div className="stat-card absent">
          <div className="stat-icon">
            <UserX />
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.absent || 0}</div>
            <div className="stat-label">Vắng mặt</div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Coffee,
  Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as ReTooltip, Legend as ReLegend, ResponsiveContainer } from 'recharts';
import './statistic.css';
import { SERVER_URL } from '@renderer/Api';

const STATUS_COLORS: Record<string, string> = {
  PRESENT: '#00C49F',
  LATE: '#FFBB28',
  LEFT_EARLY: '#FF8042',
  ABSENT: '#FF4842',
  ON_LEAVE: '#33A7FF',
  // OVERTIME: '#33A7FF',
};

const STATUS_LABELS: Record<string, string> = {
  PRESENT: 'Đúng giờ',
  LATE: 'Đi muộn',
  LEFT_EARLY: 'Về sớm',
  ABSENT: 'Nghỉ không phép',
  ON_LEAVE: 'Nghỉ phép',
  // OVERTIME: 'Làm thêm',
};

const STATUS_ICONS: Record<string, React.ComponentType<any>> = {
  PRESENT: CheckCircle,
  LATE: Clock,
  LEFT_EARLY: AlertCircle,
  ABSENT: XCircle,
  ON_LEAVE: Coffee,
  // OVERTIME: Zap,
};

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type StatusCount = {
  PRESENT: number;
  LATE: number;
  LEFT_EARLY: number;
  ABSENT: number;
  ON_LEAVE: number;
  OVERTIME: number;
};

type DayData = {
  date: string;
  statusCount: StatusCount;
};

export default function Statistic() {
  const [mode, setMode] = useState<'week' | 'month'>('month');
  const [current, setCurrent] = useState<Date>(new Date());
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Tính khoảng thời gian (tuần hoặc tháng) dựa trên mode và current
  const getRange = (): { start: Date; end: Date } => {
    if (mode === 'week') {
      // Clone current để tránh thay đổi current gốc
      const curr = new Date(current);
      const firstDay = curr.getDate() - curr.getDay() + 1; // Tuần bắt đầu từ thứ 2
      const start = new Date(curr);
      start.setDate(firstDay);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return { start, end };
    } else {
      // Clone current tránh bug, lấy full tháng
      const start = new Date(current.getFullYear(), current.getMonth(), 2);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      return { start, end };
    }
  };

  // Fetch dữ liệu thực từ backend
  const fetchData = async () => {
    setLoading(true);
    const { start, end } = getRange();
    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    try {
      const resp = await fetch(
        `${SERVER_URL}/api/timekeeping/attendance/stats?start=${startStr}&end=${endStr}`
      );
      const json = await resp.json();
      if (resp.ok) {
        // Chuyển kết quả JSON thành DayData[]
        const normalized: DayData[] = json.map((item: any) => ({
          date: item.work_date,
          statusCount: {
            PRESENT: Number(item.cnt_PRESENT) || 0,
            LATE: Number(item.cnt_LATE) || 0,
            LEFT_EARLY: Number(item.cnt_LEFT_EARLY) || 0,
            ABSENT: Number(item.cnt_ABSENT) || 0,
            ON_LEAVE: Number(item.cnt_ON_LEAVE) || 0,
            OVERTIME: Number(item.cnt_OVERTIME) || 0
          }
        }));
        setData(normalized);
      } else {
        console.error('Error fetching stats:', json);
        setData([]);
      }
    } catch (error) {
      console.error(error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, current]);

  const handlePrev = () => {
    const dt = new Date(current);
    if (mode === 'week') dt.setDate(dt.getDate() - 7);
    else dt.setMonth(dt.getMonth() - 1);
    setCurrent(dt);
  };

  const handleNext = () => {
    const dt = new Date(current);
    if (mode === 'week') dt.setDate(dt.getDate() + 7);
    else dt.setMonth(dt.getMonth() + 1);
    setCurrent(dt);
  };

  // Tính tổng số lượng từng trạng thái trong khoảng
  const getTotalCounts = (): StatusCount => {
    return data.reduce<StatusCount>(
      (totals, day) => {
        (Object.keys(totals) as Array<keyof StatusCount>).forEach(status => {
          totals[status] += Number(day.statusCount[status] || 0);
        });
        return totals;
      },
      {
        PRESENT: 0,
        LATE: 0,
        LEFT_EARLY: 0,
        ABSENT: 0,
        ON_LEAVE: 0,
        OVERTIME: 0,
      }
    );
  };

  const totals = getTotalCounts();

  // Chỉ hiển thị các status có giá trị > 0 trong pie chart
  const pieData = Object.entries(STATUS_LABELS)
    .filter(([status]) => status)
    .map(([status, label]) => ({
      name: label,
      value: totals[status as keyof StatusCount] || 0,
      color: STATUS_COLORS[status],
    }))
    .filter(item => item.value > 0);

  const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  // Định dạng chuỗi hiển thị ngày/tháng
  const formatDateRange = (): string => {
    const { start, end } = getRange();
    if (mode === 'week') {
      return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString(
        'vi-VN'
      )}`;
    }
    return `Tháng ${current.getMonth() + 1}/${current.getFullYear()}`;
  };

  // Tính tổng số lượng cho mỗi ngày để tính chiều cao cột
  const getColumnTotalCount = (dayData: DayData): number => {
    return Object.values(dayData.statusCount).reduce((sum, count) => sum + (count || 0), 0);
  };

  // Tìm giá trị lớn nhất trong mảng data để chuẩn hóa chiều cao cột
  const maxColumnCount: number = data.length
    ? Math.max(...data.map(d => getColumnTotalCount(d)))
    : 0;

  // Custom label function for pie chart
  const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, index
  }: any) => {
    if (percent < 0.04) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentValue = ((value / pieTotal) * 100).toFixed(0);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="13"
        fontWeight="bold"
        stroke="#333"
        strokeWidth="0.6"
        paintOrder="stroke"
      >
        {`${percentValue}%`}
      </text>
    );
  };

  // Hàm format label cho từng ngày
  const formatDayLabel = (dateString: string): string => {
    const date = new Date(dateString);
    if (mode === 'week') {
      return WEEKDAY_LABELS[date.getDay()];
    } else {
      return date.getDate().toString();
    }
  };

  return (
    <div className="statistic-page">
      <div className="statistic-container">
        {/* Header */}
        <div className="statistic-header">
          <BarChart3 size={32} color="#1976d2" />
          <h1 className="statistic-title">Thống kê chấm công</h1>
        </div>

        {/* Chọn chế độ (Tuần/Tháng) */}
        <div className="mode-selection">
          <div className="mode-buttons">
            <button
              onClick={() => setMode('week')}
              className={mode === 'week' ? 'mode-btn active' : 'mode-btn'}
            >
              <Calendar size={16} />
              Theo tuần
            </button>
            <button
              onClick={() => setMode('month')}
              className={mode === 'month' ? 'mode-btn active' : 'mode-btn'}
            >
              <Calendar size={16} />
              Theo tháng
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="navigation">
          <button className="nav-btn" onClick={handlePrev}>
            <ChevronLeft size={20} />
          </button>
          <div className="date-range">{formatDateRange()}</div>
          <button className="nav-btn" onClick={handleNext}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const IconComponent = STATUS_ICONS[status];
            return (
              <div key={status} className="summary-card">
                <div className="card-header">
                  <IconComponent size={20} color={STATUS_COLORS[status]} />
                  <span className="card-label">{label}</span>
                </div>
                <div
                  className="card-value"
                  style={{ color: STATUS_COLORS[status] }}
                >
                  {totals[status as keyof StatusCount] || 0}
                </div>
              </div>
            );
          })}
        </div>

        <div className="chart-pie-row">
          {/* Biểu đồ cột chồng (Stacked Bar Chart) */}
          <div className="chart-container">
            {loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <span className="loading-text">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <div
                className={`chart`}
                style={{
                  justifyContent: mode === 'week' ? 'center' : 'flex-start',
                  gap: mode === 'week' ? '30px' : '20px',
                }}
              >
                {data.map(dayData => {
                  const totalCount = getColumnTotalCount(dayData);

                  // Nếu không có dữ liệu gì, vẫn hiển thị cột nhỏ
                  if (totalCount === 0) {
                    return (
                      <div key={dayData.date} className="chart-column">
                        <div className="bars-container" style={{ height: '280px' }}>
                          <div
                            className="stacked-column"
                            style={{
                              height: '4px',
                              width: '12px',
                              backgroundColor: '#e0e0e0',
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                        <div className="bar-date">
                          {formatDayLabel(dayData.date)}
                        </div>
                      </div>
                    );
                  }

                  const columnHeight = Math.max((totalCount / maxColumnCount) * 300, 10);

                  return (
                    <div key={dayData.date} className="chart-column">
                      <div className="bars-container" style={{ height: '320px' }}>
                        <div className={`stacked-column${mode === 'week' ? ' stacked-column-week' : ''}`}
                          style={{
                            height: `${columnHeight}px`,
                            width: '15px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column-reverse',
                            borderRadius: '5px',
                            overflow: 'hidden'
                          }}
                        >
                          {(Object.keys(STATUS_COLORS) as Array<keyof StatusCount>).map(status => {
                            const count = dayData.statusCount[status] || 0;
                            if (count === 0) return null;

                            const segmentHeight = (count / totalCount) * columnHeight;

                            return (
                              <div
                                key={status}
                                className="column-segment"
                                style={{
                                  height: `${segmentHeight}px`,
                                  backgroundColor: STATUS_COLORS[status],
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  minHeight: '2px'
                                }}
                                title={`${formatDayLabel(dayData.date)}: ${STATUS_LABELS[status]} - ${count}`}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = '0.8';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = '1';
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="bar-date">
                        {formatDayLabel(dayData.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Biểu đồ tròn (Pie Chart) */}
          <div className="pie-chart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={35}
                    paddingAngle={2}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value, name) => [
                      value,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <ReLegend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">
                <Users size={48} color="#ccc" />
                <p>Không có dữ liệu để hiển thị</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Coffee,
  UserX
} from "lucide-react";
import { SERVER_URL } from "@renderer/Api";
import Button from "@renderer/components/Button/Button";
import "./PersonalTimekeepingHistory.css";

interface TimekeepingRecord {
  id: number;
  date: string; // dd/mm/yyyy
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalWorkMin: number;
  photo: string | null;
}

function getStatusLabel(status: string) {
  const statusConfig = {
    PRESENT: { label: "Đúng giờ", icon: CheckCircle, className: "status-on-time" },
    LATE: { label: "Đi muộn", icon: AlertCircle, className: "status-late" },
    LEFT_EARLY: { label: "Về sớm", icon: Clock, className: "status-early" },
    ON_LEAVE: { label: "Nghỉ phép", icon: Coffee, className: "status-leave" },
    NOT: { label: "Không đến", icon: UserX, className: "status-absent" }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    icon: XCircle,
    className: "status-default"
  };

  const IconComponent = config.icon;

  return (
    <span className={`status-chip ${config.className}`}>
      <IconComponent size={14} />
      {config.label}
    </span>
  );
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const PersonalTimekeepingHistory = ({ personId }: { personId: number }) => {
  const [data, setData] = useState<TimekeepingRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openImage, setOpenImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState(todayStr());
  const [endDate, setEndDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SERVER_URL}/api/timekeeping/person/${personId}?start=${startDate}&end=${endDate}`
      );
      if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");
      const result = await res.json();
      setData(result);
      setPage(0);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [personId, startDate, endDate]);

  const paginated = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  const handleOpenImage = (fileName: string) => {
    if (!fileName) return;
    setImageUrl(
      fileName.startsWith("http") ? fileName : `${SERVER_URL}/image/${fileName}`
    );
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setImageUrl("");
  };

  const formatWorkTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="timekeeping-container">
      {/* Header */}
      <div className="tkh-header">
        <div className="tkh-title">
          <FileText className="title-icon" />
          <h1>Lịch sử chấm công cá nhân</h1>
        </div>

        {/* Filter Controls */}
        <div className="tkh-filters">
          <div className="filter-group">
            <div className="date-input-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <span className="date-separator">đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
            <Button className="search-btn" onClick={fetchData} disabled={loading}>
              <Search size={16} />
              {loading ? "Đang tải..." : "Tìm kiếm"}
            </Button>
          </div>

          <div className="summary-info">
            <span className="record-count">
              Tổng: <strong>{data.length}</strong> bản ghi
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="timekeeping-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Ngày</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Trạng thái</th>
              <th>Thời gian làm việc</th>
              <th>Ảnh chấm công</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="loading-cell">
                  <div className="loading-spinner"></div>
                  <span>Đang tải dữ liệu...</span>
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((rec, idx) => (
                <tr key={rec.id || idx} className="table-row">
                  <td className="stt-cell">{page * rowsPerPage + idx + 1}</td>
                  <td className="date-cell">{rec.date || "—"}</td>
                  <td className="time-cell">
                    {rec.checkIn ? (
                      <span className="time-value">{rec.checkIn}</span>
                    ) : (
                      <span className="time-empty">Chưa chấm</span>
                    )}
                  </td>
                  <td className="time-cell">
                    {rec.checkOut ? (
                      <span className="time-value">{rec.checkOut}</span>
                    ) : (
                      <span className="time-empty">Chưa chấm</span>
                    )}
                  </td>
                  <td className="status-cell">{getStatusLabel(rec.status)}</td>
                  <td className="work-time-cell">
                    {rec.totalWorkMin ? formatWorkTime(rec.totalWorkMin) : "—"}
                  </td>
                  <td className="photo-cell">
                    {rec.photo ? (
                      <button
                        className="view-image-btn"
                        onClick={() => handleOpenImage(rec.photo!)}
                      >
                        <Eye size={14} />
                        Xem ảnh
                      </button>
                    ) : (
                      <span className="no-photo">Không có</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="no-data-cell">
                  <FileText size={50} className="no-data-icon" />
                  <p>Không có dữ liệu chấm công</p>
                  <small>Thử thay đổi khoảng thời gian tìm kiếm</small>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, data.length)}
            trong tổng số {data.length} bản ghi
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => setPage(0)}
              disabled={page === 0}
            >
              Đầu
            </button>
            <button
              className="pagination-btn"
              onClick={() => setPage(prev => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-current">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="pagination-btn"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
            >
              Cuối
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {openImage && (
        <div className="modal-overlay" onClick={handleCloseImage}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseImage}>
              <X size={24} />
            </button>
            <div className="modal-image-container">
              <img src={imageUrl} alt="Ảnh chấm công" className="modal-image" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalTimekeepingHistory;
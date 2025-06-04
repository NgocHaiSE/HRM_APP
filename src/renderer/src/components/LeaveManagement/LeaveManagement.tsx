import React, { useEffect, useState } from "react";
import "./LeaveManagement.css";
import { SERVER_URL } from "@renderer/Api";

export interface LeaveRecord {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

const statusColors = {
  APPROVED: "#22c55e",
  PENDING: "#eab308",
  REJECTED: "#ef4444"
};

const statusLabels = {
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Từ chối"
};

export default function LeaveManagement({ personId }: { personId: number }) {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo lấy dữ liệu giả, bạn thay bằng gọi API thực tế
  useEffect(() => {
    setLoading(true);
    fetch(`${SERVER_URL}/api/leave/person/${personId}`)
      .then(res => res.json())
      .then(data => setLeaves(data))
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  }, [personId]);

  return (
    <div className="leave-management-container">
      <h2>Danh sách ngày nghỉ</h2>
      {loading ? (
        <div className="leave-loading">Đang tải...</div>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">Không có dữ liệu</td>
              </tr>
            ) : leaves.map((lv, idx) => (
              <tr key={lv.id}>
                <td>{idx + 1}</td>
                <td>{lv.startDate}</td>
                <td>{lv.endDate}</td>
                <td>{lv.reason}</td>
                <td>
                  <span
                    className="leave-status-chip"
                    style={{ background: statusColors[lv.status] }}
                  >
                    {statusLabels[lv.status]}
                  </span>
                </td>
                <td>{lv.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

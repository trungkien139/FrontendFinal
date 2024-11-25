import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/HoaDon.css";
import { notification } from "antd";

const HoaDon = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [filteredHoaDons, setFilteredHoaDons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    maDatPhong: "",
    phuongThucThanhToan: "",
    trangThaiThanhToan: "",
  });
  const [editingHoaDon, setEditingHoaDon] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailHoaDon, setDetailHoaDon] = useState(null);

  useEffect(() => {
    fetchHoaDons();
  }, []);

  const fetchHoaDons = () => {
    axios
      .get("/home/hoadon")
      .then((response) => {
        setHoaDons(response.data);
        setFilteredHoaDons(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách hóa đơn.",
        });
      });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = hoaDons.filter(
      (hoaDon) =>
        hoaDon.maHoaDon.toString().includes(value) ||
        hoaDon.booking?.maDatPhong?.toString().includes(value)
    );
    setFilteredHoaDons(filtered);
  };

  const showCreateModal = () => {
    setFormData({
      maDatPhong: "",
      phuongThucThanhToan: "",
      trangThaiThanhToan: "",
    });
    setIsCreateModalVisible(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSubmit = () => {
    axios
      .post("/home/hoadon", formData)
      .then(() => {
        notification.success({
          message: "Tạo hóa đơn thành công!",
          description: "Hóa đơn mới đã được tạo.",
        });
        fetchHoaDons();
        closeCreateModal();
      })
      .catch((error) => {
        console.error("Lỗi khi tạo hóa đơn:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tạo hóa đơn. Vui lòng kiểm tra dữ liệu.",
        });
      });
  };

  const showEditModal = (hoaDon) => {
    setEditingHoaDon(hoaDon);
    setFormData({
      phuongThucThanhToan: hoaDon.phuongThucThanhToan,
      trangThaiThanhToan: hoaDon.trangThaiThanhToan,
    });
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditingHoaDon(null);
  };

  const handleEditSubmit = () => {
    axios
      .put(`/home/hoadon/${editingHoaDon.maHoaDon}`, formData)
      .then(() => {
        notification.success({
          message: "Cập nhật thành công!",
          description: "Hóa đơn đã được cập nhật.",
        });
        fetchHoaDons();
        closeEditModal();
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật hóa đơn:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể cập nhật hóa đơn.",
        });
      });
  };

  const showDetailModal = (hoaDon) => {
    setDetailHoaDon(hoaDon);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setDetailHoaDon(null);
  };
  const handleDelete = (maHoaDon) => {
    axios
      .delete(`/home/hoadon/${maHoaDon}`)
      .then(() => {
        notification.success({
          message: "Xóa thành công",
          description: `Hóa đơn ${maHoaDon} đã được xóa.`,
        });
        fetchHoaDons();
      })
      .catch((error) => {
        console.error("Lỗi khi xóa hóa đơn:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể xóa hóa đơn.",
        });
      });
  };

  const getDisplayValue = (key, type) => {
    const mappings = {
      phuongThucThanhToan: {
        tien_mat: "Tiền mặt",
        the_ngan_hang: "Thẻ ngân hàng",
      },
      trangThaiThanhToan: {
        chua_thanh_toan: "Chưa thanh toán",
        da_thanh_toan: "Đã thanh toán",
      },
    };
    return mappings[type][key] || "Không xác định";
  };

  return (
    <div className="hoadon-container">
      <h1 style={{ textAlign: "center" }}>Quản Lý Hóa Đơn</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm hóa đơn theo Mã hoặc Mã đặt phòng"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={showCreateModal}>Tạo Hóa Đơn</button>
      </div>
      <table className="hoadon-table">
        <thead>
          <tr>
            <th>Mã Hóa Đơn</th>
            <th>Mã Đặt Phòng</th>
            <th>Tổng Tiền</th>
            <th>Phương Thức Thanh Toán</th>
            <th>Trạng Thái</th>
            <th>Thời Gian Lập</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredHoaDons.map((hoaDon) => (
            <tr key={hoaDon.maHoaDon}>
              <td>{hoaDon.maHoaDon}</td>
              <td>{hoaDon.booking?.maDatPhong}</td>
              <td>{hoaDon.tongTien?.toLocaleString()} VND</td>
              <td>
                {getDisplayValue(
                  hoaDon.phuongThucThanhToan,
                  "phuongThucThanhToan"
                )}
              </td>
              <td>
                {getDisplayValue(
                  hoaDon.trangThaiThanhToan,
                  "trangThaiThanhToan"
                )}
              </td>
              <td>{hoaDon.thoiGianLapHoaDon}</td>
              <td>
                <button onClick={() => showDetailModal(hoaDon)}>
                  <i class="fa-regular fa-newspaper"></i>
                </button>
                <button onClick={() => showEditModal(hoaDon)}>
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => handleDelete(hoaDon.maHoaDon)}>
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCreateModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Tạo Hóa Đơn</h2>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label>Mã Đặt Phòng</label>
                <input
                  type="text"
                  value={formData.maDatPhong}
                  onChange={(e) =>
                    setFormData({ ...formData, maDatPhong: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phương Thức Thanh Toán</label>
                <select
                  value={formData.phuongThucThanhToan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phuongThucThanhToan: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled hidden>
                    Chọn phương thức
                  </option>
                  <option value="tien_mat">Tiền mặt</option>
                  <option value="the_ngan_hang">Thẻ ngân hàng</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Tạo</button>
                <button type="button" onClick={closeCreateModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Cập Nhật Hóa Đơn</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Trạng Thái Thanh Toán</label>
                <select
                  value={formData.trangThaiThanhToan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      trangThaiThanhToan: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled hidden>
                    Chọn trạng thái
                  </option>
                  <option value="chua_thanh_toan">Chưa thanh toán</option>
                  <option value="da_thanh_toan">Đã thanh toán</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phương Thức Thanh Toán</label>
                <select
                  value={formData.phuongThucThanhToan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phuongThucThanhToan: e.target.value,
                    })
                  }
                  required
                >
                  <option value="" disabled hidden>
                    Chọn phương thức
                  </option>
                  <option value="tien_mat">Tiền mặt</option>
                  <option value="the_ngan_hang">Thẻ ngân hàng</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Cập Nhật</button>
                <button type="button" onClick={closeEditModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDetailModalVisible && detailHoaDon && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Chi Tiết Hóa Đơn</h2>
            <p>
              <strong>Mã Hóa Đơn:</strong> {detailHoaDon.maHoaDon}
            </p>
            <p>
              <strong>Thời Gian Lập Hóa Đơn:</strong>{" "}
              {detailHoaDon.thoiGianLapHoaDon}
            </p>
            <p>
              <strong>Phương Thức Thanh Toán:</strong>
              {getDisplayValue(
                detailHoaDon.phuongThucThanhToan,
                "phuongThucThanhToan"
              )}
            </p>
            <p>
              <strong>Trạng Thái Thanh Toán:</strong>
              {getDisplayValue(
                detailHoaDon.trangThaiThanhToan,
                "trangThaiThanhToan"
              )}
            </p>

            <h3>Thông Tin Đặt Phòng</h3>
            <p>
              <strong>Mã Đặt Phòng:</strong> {detailHoaDon.booking?.maDatPhong}
            </p>
            <p>
              <strong>Ngày Nhận Phòng:</strong>{" "}
              {detailHoaDon.booking?.ngayNhanPhong}
            </p>
            <p>
              <strong>Ngày Trả Phòng:</strong>{" "}
              {detailHoaDon.booking?.ngayTraPhong}
            </p>

            <h3>Khách Hàng</h3>
            <p>
              <strong>Tên:</strong> {detailHoaDon.booking?.khachHang?.hoTen}
            </p>
            <p>
              <strong>Địa Chỉ:</strong>{" "}
              {detailHoaDon.booking?.khachHang?.diaChi}
            </p>
            <p>
              <strong>Số Điện Thoại:</strong>{" "}
              {detailHoaDon.booking?.khachHang?.soDienThoai}
            </p>
            <p>
              <strong>Giấy Tờ Tùy Thân:</strong>{" "}
              {detailHoaDon.booking?.khachHang?.giayToTuyThan}
            </p>

            <h3>Phòng</h3>
            <p>
              <strong>Mã Phòng:</strong> {detailHoaDon.booking?.phong?.maPhong}
            </p>
            <p>
              <strong>Loại Phòng:</strong>{" "}
              {detailHoaDon.booking?.phong?.loaiPhong}
            </p>
            <p>
              <strong>Giá Phòng:</strong>{" "}
              {detailHoaDon.booking?.phong?.giaPhong?.toLocaleString()} VND
            </p>

            <h3>Dịch Vụ Sử Dụng</h3>
            {detailHoaDon.booking?.suDungDichVuList?.length > 0 ? (
              <ul>
                {detailHoaDon.booking.suDungDichVuList.map((dichVu) => (
                  <li key={dichVu.maSuDungDichVu}>
                    {dichVu.dichVu?.tenDichVu} - {dichVu.soLuong} x{" "}
                    {dichVu.dichVu?.giaDichVu?.toLocaleString()} VND
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có dịch vụ nào được sử dụng.</p>
            )}

            <button onClick={closeDetailModal}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoaDon;

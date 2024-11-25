import React, { useState } from "react";
import { Modal, Button } from "antd";
import "../Style/NewBooking.css";

const NewBooking = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    maKhachHang: "",
    maPhong: "",
    maNhanVien: "",
    ngayNhanPhong: "",
    ngayTraPhong: "",
    giaPhongThucTe: "",
    trangThaiDatPhong: "da_dat",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      title="Đặt phòng mới"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className="new-booking-modal"
    >
      <form className="new-booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Khách hàng (Mã Khách Hàng)</label>
          <input
            type="text"
            name="maKhachHang"
            value={formData.maKhachHang}
            onChange={handleChange}
            placeholder="Nhập mã khách hàng"
            required
          />
        </div>
        <div className="form-group">
          <label>Phòng (Mã Phòng)</label>
          <input
            type="text"
            name="maPhong"
            value={formData.maPhong}
            onChange={handleChange}
            placeholder="Nhập mã phòng"
            required
          />
        </div>
        <div className="form-group">
          <label>Nhân viên (Mã Nhân Viên)</label>
          <input
            type="text"
            name="maNhanVien"
            value={formData.maNhanVien}
            onChange={handleChange}
            placeholder="Nhập mã nhân viên"
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày nhận phòng</label>
          <input
            type="date"
            name="ngayNhanPhong"
            value={formData.ngayNhanPhong}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày trả phòng</label>
          <input
            type="date"
            name="ngayTraPhong"
            value={formData.ngayTraPhong}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Giá Phòng Thực Tế</label>
          <input
            type="number"
            name="giaPhongThucTe"
            value={formData.giaPhongThucTe}
            onChange={handleChange}
            placeholder="Nhập giá phòng thực tế"
            required
          />
        </div>
        <div className="form-group">
          <label>Trạng thái đặt phòng</label>
          <select
            name="trangThaiDatPhong"
            value={formData.trangThaiDatPhong}
            onChange={handleChange}
          >
            <option value="da_dat">Đã đặt</option>
            <option value="dang_su_dung">Đang sử dụng</option>
            <option value="con_trong">Còn trống</option>
            <option value="dang_don_dep">Đang dọn dẹp</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Lưu
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewBooking;

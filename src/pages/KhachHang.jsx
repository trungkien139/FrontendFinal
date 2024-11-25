import React, { useState, useEffect } from "react";
import axios from "axios";
import KhachHangModal from "react-modal";
import "../Style/KhachHang.css";

const KhachHang = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/home/khachhangs");
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
  };

  const handleDelete = async (maKhachHang) => {
    try {
      await axios.delete(`/home/khachhangs/${maKhachHang}`);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi xóa khách hàng:", error);
    }
  };

  const openModal = (customer = null) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const customerData = {
      hoTen: formData.get("hoTen"),
      diaChi: formData.get("diaChi"),
      soDienThoai: formData.get("soDienThoai"),
      namSinh: formData.get("namSinh"),
      giayToTuyThan: formData.get("giayToTuyThan"),
    };

    try {
      if (currentCustomer) {
        await axios.put(
          `/home/khachhangs/${currentCustomer.maKhachHang}`,
          customerData
        );
      } else {
        await axios.post("/home/khachhangs", customerData);
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu khách hàng:", error);
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.hoTen?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="khachhang-page-container">
      <h1 className="khachhang-page-title">Quản lý Khách Hàng</h1>
      <div className="khachhang-search-add-bar">
        <input
          type="text"
          placeholder="Tìm khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => openModal()}>
          <i class="fa-solid fa-user-plus"></i>
        </button>
      </div>
      <table className="khachhang-table">
        <thead>
          <tr>
            <th>Mã KH</th>
            <th>Tên Khách Hàng</th>
            <th>SĐT</th>
            <th>Địa Chỉ</th>
            <th>Năm Sinh</th>
            <th>Giấy Tờ Tùy Thân</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filteredCustomers.map((customer) => (
              <tr key={customer.maKhachHang}>
                <td>{customer.maKhachHang}</td>
                <td>{customer.hoTen}</td>
                <td>{customer.soDienThoai}</td>
                <td>{customer.diaChi}</td>
                <td>{customer.namSinh}</td>
                <td>{customer.giayToTuyThan}</td>
                <td>
                  <button
                    className="khachhang-update"
                    onClick={() => openModal(customer)}
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="khachhang-delete"
                    onClick={() => handleDelete(customer.maKhachHang)}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <KhachHangModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <button className="khachhang-close-button" onClick={closeModal}>
          ✖
        </button>
        <h2>{currentCustomer ? "Sửa Khách Hàng" : "Thêm Khách Hàng"}</h2>
        <form onSubmit={handleSave}>
          <label>
            Tên Khách Hàng:
            <input
              type="text"
              name="hoTen"
              defaultValue={currentCustomer?.hoTen || ""}
              required
            />
          </label>
          <label>
            Số Điện Thoại:
            <input
              type="text"
              name="soDienThoai"
              defaultValue={currentCustomer?.soDienThoai || ""}
              required
            />
          </label>
          <label>
            Địa Chỉ:
            <input
              type="text"
              name="diaChi"
              defaultValue={currentCustomer?.diaChi || ""}
              required
            />
          </label>
          <label>
            Năm Sinh:
            <input
              type="date"
              name="namSinh"
              defaultValue={currentCustomer?.namSinh || ""}
              required
            />
          </label>
          <label>
            Giấy Tờ Tùy Thân:
            <input
              type="text"
              name="giayToTuyThan"
              defaultValue={currentCustomer?.giayToTuyThan || ""}
              required
            />
          </label>
          <button type="submit">Lưu</button>
          <button type="button" onClick={closeModal}>
            Hủy
          </button>
        </form>
      </KhachHangModal>
    </div>
  );
};

export default KhachHang;

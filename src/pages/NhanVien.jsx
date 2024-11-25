import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import "../Style/NhanVien.css";
import "../Style/NhanVienModal.css";

const NhanVien = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Lấy danh sách nhân viên từ backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/home/nhanviens"); // URL API
      console.log("Dữ liệu nhân viên:", response.data);
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
  };

  // Xóa nhân viên
  const handleDelete = async (maNhanVien) => {
    try {
      await axios.delete(`/home/nhanviens/${maNhanVien}`);
      fetchEmployees(); // Làm mới danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
    }
  };

  // Mở modal để thêm hoặc sửa nhân viên
  const openModal = (employee = null) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  // Lưu nhân viên (thêm hoặc sửa)
  const handleSave = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const employeeData = {
      hoTen: formData.get("hoTen"),
      chucVu: formData.get("chucVu"),
      soDienThoai: formData.get("soDienThoai"),
      luong: parseFloat(formData.get("luong")),
    };

    try {
      if (currentEmployee) {
        // Sửa nhân viên
        await axios.put(
          `/home/nhanviens/${currentEmployee.maNhanVien}`,
          employeeData
        );
      } else {
        // Thêm mới nhân viên
        await axios.post("/home/nhanviens", employeeData);
      }
      fetchEmployees(); // Làm mới danh sách
      closeModal(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
    }
  };

  // Lọc danh sách nhân viên theo tìm kiếm
  const filteredEmployees = employees.filter((employee) =>
    employee.hoTen?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="nhanvien-container">
      <h1>Quản lý Nhân Viên</h1>
      <div className="nhanviensearch-add-bar">
        <input
          type="text"
          placeholder="Tìm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => openModal()} className="iconadd-button">
          <i class="fa-solid fa-user-plus"></i>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Tên Nhân Viên</th>
            <th>Chức vụ</th>
            <th>SDT</th>
            <th>Lương</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filteredEmployees.map((employee) => (
              <tr key={employee.maNhanVien}>
                <td>{employee.maNhanVien}</td>
                <td>{employee.hoTen}</td>
                <td>{employee.chucVu}</td>
                <td>{employee.soDienThoai}</td>
                <td>{employee.luong}</td>
                <td>
                  <button
                    className="update"
                    onClick={() => openModal(employee)}
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDelete(employee.maNhanVien)}
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal thêm/sửa nhân viên */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false} // Để tránh cảnh báo trên console
      >
        <button className="nhanvienmodalclose-button" onClick={closeModal}>
          ✖
        </button>
        <h2>{currentEmployee ? "Sửa Nhân Viên" : "Thêm Nhân Viên"}</h2>
        <form onSubmit={handleSave}>
          <label>
            Tên Nhân Viên:
            <input
              type="text"
              name="hoTen"
              defaultValue={currentEmployee?.hoTen || ""}
              required
            />
          </label>
          <label>
            Chức vụ:
            <input
              type="text"
              name="chucVu"
              defaultValue={currentEmployee?.chucVu || ""}
              required
            />
          </label>
          <label>
            Số điện thoại:
            <input
              type="text"
              name="soDienThoai"
              defaultValue={currentEmployee?.soDienThoai || ""}
              required
            />
          </label>
          <label>
            Lương:
            <input
              type="number"
              name="luong"
              defaultValue={currentEmployee?.luong || ""}
              required
            />
          </label>
          <button type="submit">Lưu</button>
          <button type="button" onClick={closeModal}>
            Hủy
          </button>
        </form>
      </ReactModal>
    </div>
  );
};

export default NhanVien;

import React, { useEffect, useState } from "react";
import { Table, Input, Button, notification, Modal } from "antd";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import NewBooking from "../Components/NewBooking";
import ServiceAdd from "../Components/ServiceAdd";
import "../Style/Booking.css";
const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [thongTin, setThongTin] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [usingService, setUsingService] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);
  const fetchBookings = async () => {
    try {
      const response = await axios.get("home/booking");
      const data = response.data;
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error(" Lỗi khi lấy booking", error);
    }
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = bookings.filter((booking) =>
      booking.khachHang.hoTen.toLowerCase().includes(value)
    );
    setFilteredBookings(filtered);
  };
  const columns = [
    {
      title: "Mã Đặt Phòng",
      dataIndex: "maDatPhong",
      key: "maDatPhong",
    },
    {
      title: "Tên Khách Hàng",
      key: "khachHang",
      render: (_, record) => record.khachHang.hoTen,
    },
    {
      title: "Mã Phòng",
      key: "maPhong",
      render: (_, record) => record.phong.maPhong,
    },
    {
      title: "Loại phòng",
      key: "phong",
      render: (_, record) => record.phong.loaiPhong,
    },
    {
      title: "Tên nhân viên",
      key: "nhanVien",
      render: (_, record) => record.nhanVien.hoTen,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            type="link"
            style={{ fontSize: "30px", padding: "0", margin: "0" }} // Tăng kích cỡ icon và loại bỏ padding/margin
            onClick={() => handleViewTT(record)}
            icon={<FontAwesomeIcon icon={faFileAlt} />}
          />

          <Button
            type="link"
            style={{
              fontSize: "30px",
              padding: "0",
              margin: "0",
              color: "red",
            }} // Tăng kích cỡ và thay đổi màu của icon
            onClick={() => handleDelete(record.maDatPhong)}
            icon={<FontAwesomeIcon icon={faTrash} />}
          />
        </div>
      ),
    },
  ];
  const handleDelete = (maDatPhong) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: ` Bạn có chắc chắc muốn xóa Booking với id ${maDatPhong}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        axios
          .delete(`home/booking/${maDatPhong}`)
          .then(() => {
            notification.success({
              message: "Xóa thành công",
              description: `Booking ${maDatPhong} đã được xóa thành công`,
            });
            fetchBookings();
          })
          .catch((error) => {
            console.error("Lỗi xóa booking", error);
          });
      },
    });
  };
  const handleViewTT = (bookings) => {
    setSelectedBooking(bookings);
    setThongTin(true);
  };
  const handleCloseView = () => {
    setThongTin(false);
    setSelectedBooking(null);
  };
  const handleAddBooking = (values) => {
    const payload = {
      ...values,
      ngayNhanPhong: values.ngayNhanPhong,
      ngayTraPhong: values.ngayTraPhong,
    };

    axios
      .post("home/booking", payload)
      .then(() => {
        notification.success({
          message: "Thành công",
          description: "Đặt phòng mới thành công!",
        });
        console.log("Dữ liệu nhận được từ NewBooking:", values);

        fetchBookings();
        setIsAdding(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tạo booking", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tạo booking mới.",
        });
      });
  };

  const handleCalculateTotal = async (maDatPhong) => {
    try {
      const response = await axios.get(`/home/booking/${maDatPhong}/tongtien`);
      const total = response.data;

      notification.info({
        message: "Tổng tiền",
        description: `Tổng tiền của booking ${maDatPhong} là ${total.toLocaleString()} VND.`,
      });
    } catch (error) {
      console.error("Lỗi khi tính tổng tiền:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tính tổng tiền.",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
        }}
      >
        Quản Lý Booking
      </h1>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input
          placeholder="Tìm kiếm tên khách hàng"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={() => setIsAdding(true)}>
          Đặt phòng
        </Button>
        <NewBooking
          visible={isAdding}
          onClose={() => setIsAdding(false)}
          onSubmit={handleAddBooking}
        />
      </header>
      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="maDatPhong"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Chi tiết booking"
        visible={thongTin}
        onCancel={handleCloseView}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <p>Mã booking: {selectedBooking.maDatPhong}</p>
            <p>Ngày nhận phòng: {selectedBooking.ngayNhanPhong}</p>
            <p>Ngày trả phòng: {selectedBooking.ngayTraPhong}</p>
            <p>Khách hàng: {selectedBooking.khachHang.hoTen}</p>
            <p>Loại phòng: {selectedBooking.phong.loaiPhong}</p>
            <p>Nhân viên: {selectedBooking.nhanVien.hoTen}</p>
            <p>Giá Phòng thực tế: {selectedBooking.giaPhongThucTe}</p>

            <p>Dịch Vụ sử dụng:</p>
            <ul>
              {selectedBooking.suDungDichVuList.map((dichVu, index) => (
                <li key={index}>
                  Dịch vụ: {dichVu.dichVu.tenDichVu}, Giá:{" "}
                  {dichVu.dichVu.giaDichVu}, Số lượng: {dichVu.soLuong}
                </li>
              ))}
            </ul>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button type="primary" onClick={() => setUsingService(true)}>
                Sử dụng dịch vụ
              </Button>
              <Button
                type="default"
                onClick={() => handleCalculateTotal(selectedBooking.maDatPhong)}
              >
                Tổng tiền
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ServiceAdd
        visible={usingService}
        onClose={() => setUsingService(false)}
        maDatPhong={selectedBooking?.maDatPhong}
        onServiceAdded={fetchBookings}
      />
    </div>
  );
};
export default Booking;

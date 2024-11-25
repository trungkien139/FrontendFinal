import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Style/Room.css";
import RoomDetail from "../Components/RoomDetail";
import { Popconfirm, notification, Input } from "antd";
import FindRoom from "../Components/FindRoom";

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoom, setEditedRoom] = useState({});
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({
    loaiPhong: "",
    giaPhong: "",
    trangThaiPhong: "con_trong",
  });
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    axios
      .get("home/phongs")
      .then((response) => {
        setRooms(response.data);
        setFilteredRooms(response.data);
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách phòng:", error);
      });
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleDelete = (maPhong) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa phòng: ${maPhong}?`
    );
    if (confirmDelete) {
      axios
        .delete(`home/phongs/${maPhong}`)
        .then(() => {
          notification.success({
            message: "Thành công",
            description: "Xóa phòng thành công",
          });
          fetchRooms();
          setSelectedRoom(null);
        })
        .catch((error) => {
          console.error("Lỗi khi xóa phòng:", error);
        });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedRoom(selectedRoom);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddRoomToggle = () => {
    setIsAdding(true);
    setNewRoom({
      loaiPhong: "",
      giaPhong: "",
      trangThaiPhong: "con_trong",
    });
  };
  const handleAddRoomSubmit = () => {
    axios
      .post("home/phongs", newRoom)
      .then(() => {
        notification.success({
          message: "Thành công",
          description: "Phòng mới đã được thêm.",
        });
        fetchRooms();
        setIsAdding(false);
      })
      .catch((error) => {
        console.error("Lỗi khi thêm phòng:", error);
      });
  };
  const handleEditSubmit = () => {
    axios
      .put(`home/phongs/${editedRoom.maPhong}`, editedRoom)
      .then(() => {
        notification.success({
          message: "Thành công",
          description: "Cập nhật thông tin phòng thành công",
        });
        fetchRooms();
        setIsEditing(false);
        setSelectedRoom(editedRoom);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật phòng:", error);
      });
  };

  const handleCloseDetail = () => {
    setSelectedRoom(null);
  };
  const getDisplayValue = (trangThaiPhong) => {
    const trangThaiPhongMap = {
      con_trong: "Còn trống",
      da_dat: "Đã đặt",
      dang_su_dung: "Đang sử dụng",
      dang_don: "Bảo trì",
    };
    return trangThaiPhongMap[trangThaiPhong] || "Không xác định";
  };
  const handleClose = () => {
    setSelectedRoom(null);
    setIsAdding(false);
    setIsEditing(false);
  };

  return (
    <div>
      <FindRoom
        rooms={rooms}
        onFilter={(filtered) => setFilteredRooms(filtered)}
        onAddRoom={handleAddRoomToggle}
      />
      {isAdding && (
        <div className="room-detail-overlay">
          <div className="room-detail-container">
            <h2>Thêm Phòng Mới</h2>
            <form>
              <label>
                Mã phòng:
                <input
                  type="text"
                  value={newRoom.maPhong}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, maPhong: e.target.value })
                  }
                />
              </label>
              <label>
                Loại phòng:
                <input
                  type="text"
                  value={newRoom.loaiPhong}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, loaiPhong: e.target.value })
                  }
                />
              </label>
              <label>
                Giá phòng:
                <input
                  type="number"
                  value={newRoom.giaPhong}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, giaPhong: e.target.value })
                  }
                />
              </label>
              <label>
                Trạng thái:
                <select
                  value={newRoom.trangThaiPhong}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, trangThaiPhong: e.target.value })
                  }
                >
                  <option value="con_trong">Còn trống</option>
                  <option value="da_dat">Đã đặt</option>
                  <option value="dang_su_dung">Đang sử dụng</option>
                  <option value="dang_don">Bảo trì</option>
                </select>
              </label>
              <div className="button-container">
                <button
                  type="button"
                  className="edit-button"
                  onClick={handleAddRoomSubmit}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="close-button"
                  onClick={handleClose}
                >
                  X
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="room-container">
        {filteredRooms.map((room) => (
          <div
            key={room.maPhong}
            className={`room-card ${
              room.trangThaiPhong === "da_dat"
                ? "booked"
                : room.trangThaiPhong === "dang_su_dung"
                ? "in-use"
                : room.trangThaiPhong === "dang_don"
                ? "maintenance"
                : "available"
            }`}
            onClick={() => handleRoomClick(room)}
          >
            <h3>Phòng: {room.maPhong}</h3>
            <p>Loại phòng: {room.loaiPhong}</p>
            <p>Giá phòng: {room.giaPhong.toLocaleString("vi-VN")} VND</p>
            <p>Trạng thái: {getDisplayValue(room.trangThaiPhong)}</p>
          </div>
        ))}
      </div>
      {selectedRoom && !isEditing && (
        <RoomDetail
          room={selectedRoom}
          onEdit={handleEditToggle}
          onDelete={handleDelete}
          onClose={handleCloseDetail}
        />
      )}
      {isEditing && (
        <div className="room-detail-overlay">
          <div className="updateroom-detail-container">
            <h2>Chỉnh Sửa Thông Tin Phòng</h2>
            <form>
              <label>
                Loại phòng:
                <input
                  type="text"
                  name="loaiPhong"
                  value={editedRoom.loaiPhong}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Giá phòng:
                <input
                  type="number"
                  name="giaPhong"
                  value={editedRoom.giaPhong}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Trạng thái:
                <select
                  name="trangThaiPhong"
                  value={editedRoom.trangThaiPhong}
                  onChange={handleEditChange}
                >
                  <option value="con_trong">Còn trống</option>
                  <option value="da_dat">Đã đặt</option>
                  <option value="dang_su_dung">Đang sử dụng</option>
                  <option value="dang_don">Bảo trì</option>
                </select>
              </label>
              <div className="button-container">
                <button
                  type="button"
                  className="updateedit-button"
                  onClick={handleEditSubmit}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="updateclose-button"
                  onClick={() => setIsEditing(false)}
                >
                  x
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;

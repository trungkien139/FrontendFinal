import React, { useState } from "react";
import "../Style/FindRoom.css"

const FindRoom = ({ rooms, onFilter,onAddRoom }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredRooms = rooms.filter(
      (room) =>
        room.maPhong.toString().includes(value) || 
        room.loaiPhong.toLowerCase().includes(value.toLowerCase()) ||
        room.trangThaiPhong.toLowerCase().includes(value)

    );

    onFilter(filteredRooms);
  };

  return (
    <div className="timkiemphong" style={{ marginBottom: "20px" }}>
      <input
        placeholder="Tìm kiếm phòng..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: "300px" }}
      />
       <button onClick={onAddRoom} className="add-room-button">
        Thêm Phòng
      </button>
    </div>
  );
};

export default FindRoom;

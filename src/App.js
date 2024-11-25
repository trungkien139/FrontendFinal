import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Style/App.css";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Room from "./pages/Room";
import KhachHang from "./pages/KhachHang";
import NhanVien from "./pages/NhanVien";
import Booking from "./pages/Booking";
import DichVu from "./pages/DichVu";
import HoaDon from "./pages/HoaDon";

function App() {
  return (
    <Router>
      <Navbar />
      <div
        style={{
          marginLeft: "200px",
          padding: "0",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/nhanvien" element={<NhanVien />} />
          <Route path="/khachhang" element={<KhachHang />} />
          <Route path="/dichvu" element={<DichVu />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/hoadon" element={<HoaDon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

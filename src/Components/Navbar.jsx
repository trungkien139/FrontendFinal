import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faLandmark,
  faUserTie,
  faUser,
  faBellConcierge,
  faCalendarDays,
  faWallet,
} from "@fortawesome/free-solid-svg-icons"; // Import các icon
import "../Style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <FontAwesomeIcon icon={faHouse} style={{ marginRight: "8px" }} /> TRANG
        CHỦ
      </Link>
      <Link to="/room">
        <FontAwesomeIcon icon={faLandmark} style={{ marginRight: "8px" }} />{" "}
        PHÒNG
      </Link>
      <Link to="/nhanvien">
        <FontAwesomeIcon icon={faUserTie} style={{ marginRight: "8px" }} /> NHÂN
        VIÊN
      </Link>
      <Link to="/khachhang">
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} /> KHÁCH
        HÀNG
      </Link>
      <Link to="/dichvu">
        <FontAwesomeIcon
          icon={faBellConcierge}
          style={{ marginRight: "8px" }}
        />{" "}
        DỊCH VỤ
      </Link>
      <Link to="/booking">
        <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: "8px" }} />{" "}
        ĐẶT PHÒNG
      </Link>
      <Link to="/hoadon">
        <FontAwesomeIcon icon={faWallet} style={{ marginRight: "8px" }} /> HÓA
        ĐƠN
      </Link>
    </nav>
  );
};

export default Navbar;

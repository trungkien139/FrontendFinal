import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Button, notification } from "antd";
import axios from "axios";
import "../Style/ServiceAdd.css";

const { Option } = Select;

const ServiceAdd = ({ visible, onClose, maDatPhong, onServiceAdded }) => {
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [serviceForm, setServiceForm] = useState({ maDichVu: "", soLuong: 1 });

  // Lấy danh sách dịch vụ từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/home/dichvus"); // API để lấy danh sách dịch vụ
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = () => {
    const payload = {
      maDatPhong: maDatPhong,
      maDichVu: serviceForm.maDichVu,
      soLuong: serviceForm.soLuong,
    };

    axios
      .post("/home/sudungdichvu", payload)
      .then(() => {
        notification.success({
          message: "Thành công",
          description: "Đã thêm dịch vụ vào booking.",
        });
        onServiceAdded();
        onClose();
      })
      .catch((error) => {
        console.error("Lỗi khi sử dụng dịch vụ:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể thêm dịch vụ.",
        });
      });
  };

  return (
    <Modal
      title="Sử dụng dịch vụ"
      visible={visible}
      onCancel={onClose}
      footer={[
        <div className="service-add-modal-footer" key="footer">
          <Button key="cancel" onClick={onClose}>
            Hủy
          </Button>
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>,
      ]}
    >
      <Form layout="vertical" className="service-add-modal">
        <Form.Item label="Dịch vụ">
          <Select
            value={serviceForm.maDichVu}
            onChange={(value) =>
              setServiceForm({ ...serviceForm, maDichVu: value })
            }
            placeholder="Chọn dịch vụ"
          >
            {services.map((service) => (
              <Option key={service.maDichVu} value={service.maDichVu}>
                {service.tenDichVu} (Giá: {service.giaDichVu.toLocaleString()}{" "}
                VND)
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Số lượng">
          <Input
            type="number"
            min={1}
            value={serviceForm.soLuong}
            onChange={(e) =>
              setServiceForm({ ...serviceForm, soLuong: e.target.value })
            }
            placeholder="Nhập số lượng"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceAdd;

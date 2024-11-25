import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, notification } from "antd";
import axios from "axios";
import "../Style/DichVu.css";

const DichVu = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [form] = Form.useForm();

  // Fetch danh sách dịch vụ từ backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("/home/dichvus");
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể lấy danh sách dịch vụ.",
      });
    }
  };

  // Mở modal (Thêm hoặc Sửa)
  const openModal = (type, service = null) => {
    setModalType(type);
    setCurrentService(service);
    setIsModalOpen(true);
    if (service) {
      form.setFieldsValue(service);
    } else {
      form.resetFields();
    }
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
    form.resetFields();
  };

  // Thêm hoặc cập nhật dịch vụ
  const handleSave = async (values) => {
    const data = {
      maDichVu: values.maDichVu,
      tenDichVu: values.tenDichVu,
      giaDichVu: parseFloat(values.giaDichVu),
    };

    try {
      if (modalType === "edit" && currentService) {
        // Cập nhật dịch vụ
        await axios.put(`/home/dichvus/${currentService.maDichVu}`, data);
        notification.success({
          message: "Thành công",
          description: "Dịch vụ đã được cập nhật!",
        });
      } else {
        // Thêm mới dịch vụ
        await axios.post("/home/dichvus", data);
        notification.success({
          message: "Thành công",
          description: "Dịch vụ mới đã được thêm!",
        });
      }
      fetchServices();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu dịch vụ:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể lưu dịch vụ.",
      });
    }
  };

  // Xóa dịch vụ
  const handleDelete = async (maDichVu) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa dịch vụ với mã ${maDichVu}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axios.delete(`/home/dichvus/${maDichVu}`);
          notification.success({
            message: "Thành công",
            description: "Dịch vụ đã được xóa!",
          });
          fetchServices();
        } catch (error) {
          console.error("Lỗi khi xóa dịch vụ:", error);
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa dịch vụ.",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã Dịch Vụ",
      dataIndex: "maDichVu",
      key: "maDichVu",
    },
    {
      title: "Tên Dịch Vụ",
      dataIndex: "tenDichVu",
      key: "tenDichVu",
    },
    {
      title: "Giá Dịch Vụ",
      dataIndex: "giaDichVu",
      key: "giaDichVu",
      render: (giaDichVu) =>
        `${giaDichVu.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, service) => (
        <div style={{ display: "flex", gap: "12px", fontSize: "30px" }}>
          <Button type="primary" onClick={() => openModal("edit", service)}>
            <i class="fa-regular fa-pen-to-square"></i>
          </Button>
          <Button type="danger" onClick={() => handleDelete(service.maDichVu)}>
            <i class="fa-solid fa-trash-can"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Quản Lý Dịch Vụ
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm dịch vụ"
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            const filtered = services.filter((service) =>
              service.tenDichVu.toLowerCase().includes(value)
            );
            setServices(filtered);
          }}
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={() => openModal("add")}>
          <i class="fa-solid fa-plus"></i>Thêm Dịch Vụ
        </Button>
      </div>
      <Table
        dataSource={services}
        columns={columns}
        rowKey="maDichVu"
        pagination={{ pageSize: 10 }}
        bordered
      />

      {/* Modal thêm hoặc sửa dịch vụ */}
      <Modal
        title={modalType === "edit" ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={currentService}
        >
          <Form.Item name="maDichVu" label="Mã Dịch Vụ">
            <Input
              type="number"
              placeholder="Nhập mã dịch vụ"
              disabled={modalType === "edit"}
            />
          </Form.Item>
          <Form.Item name="tenDichVu" label="Tên Dịch Vụ">
            <Input placeholder="Nhập tên dịch vụ" />
          </Form.Item>
          <Form.Item name="giaDichVu" label="Giá Dịch Vụ">
            <Input type="number" placeholder="Nhập giá dịch vụ" />
          </Form.Item>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <Button onClick={closeModal}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DichVu;

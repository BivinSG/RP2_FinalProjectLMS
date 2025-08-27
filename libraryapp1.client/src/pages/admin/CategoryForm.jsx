import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

export default function CategoryForm() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const apiBaseUrl = "https://localhost:7023/api/category";

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      const data = response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show modal for adding new category
  const showModal = () => {
    setEditingRow(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Edit existing category
  const handleEdit = (record) => {
    setEditingRow(record);
    form.setFieldsValue({ category_name: record.categoryName });
    setModalVisible(true);
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      message.success("Category deleted");
      fetchCategories();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  // Handle add/update category
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const categoryData = { categoryName: values.category_name };

      if (editingRow) {
        await axios.put(`${apiBaseUrl}/${editingRow.categoryId}`, {
          categoryId: editingRow.categoryId,
          ...categoryData,
        });
        message.success("Category updated");
      } else {
        await axios.post(apiBaseUrl, categoryData);
        message.success("Category added");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingRow(null);
      fetchCategories();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const columns = [
    { title: "Category ID", dataIndex: "categoryId", key: "categoryId" },
    { title: "Category Name", dataIndex: "categoryName", key: "categoryName" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.categoryId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(27,67,50,0.15)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          borderBottom: "2px solid #1b4332",
          paddingBottom: 8,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#1b4332",
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 1,
          }}
        >
          Category List
        </h2>
        <Button
          style={{
            backgroundColor: "#1b4332",
            borderColor: "#1b4332",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 8,
            padding: "0 24px",
            boxShadow: "0 5px 15px rgba(27,67,50,0.3)",
            transition: "all 0.3s ease",
          }}
          onClick={showModal}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15552f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1b4332")}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={Array.isArray(categories) ? categories : []}
        columns={columns}
        rowKey="categoryId"
        pagination={false}
        bordered
        style={{
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
          backgroundColor: "#fff",
        }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-even" : "table-row-odd"
        }
      />

      {/* Modal */}
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: 20,
              color: "#1b4332",
            }}
          >
            {editingRow ? "✏️ Edit Category" : "➕ Add Category"}
          </div>
        }
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingRow(null);
        }}
        okText={editingRow ? "Update" : "Add"}
        centered
        bodyStyle={{
          padding: "30px 40px",
          backgroundColor: "#f2f6f2",
          borderRadius: 10,
        }}
        okButtonProps={{
          style: {
            backgroundColor: "#1b4332",
            borderColor: "#1b4332",
            fontWeight: 600,
            borderRadius: 8,
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: 8,
            fontWeight: "600",
          },
        }}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="Category Name"
            name="category_name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input
              maxLength={50}
              placeholder="Enter category name"
              style={{
                borderRadius: 8,
                fontSize: 16,
                padding: "10px 14px",
                borderColor: "#c9d6c8",
                boxShadow: "inset 0 1px 3px rgba(27,67,50,0.1)",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1b4332")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#c9d6c8")}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Additional CSS */}
      <style>
        {`
          .table-row-even {
            background-color: #fdfdfd;
          }
          .table-row-odd {
            background-color: #f6f9f6;
          }
          .ant-table-thead > tr > th {
            background-color: #d8e6d8 !important;
            color: #1b4332;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.03em;
          }
          .ant-modal-content {
            border-radius: 14px !important;
            box-shadow: 0 10px 25px rgba(27,67,50,0.15);
          }
        `}
      </style>
    </div>
  );
}

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

export default function LanguageForm() {
  const [form] = Form.useForm();
  const [languages, setLanguages] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const baseURL = "https://localhost:7023/api/language";

  // Fetch languages
  const fetchLanguages = async () => {
    try {
      const response = await axios.get(baseURL);
      const data = response.data;
      setLanguages(Array.isArray(data) ? data : []);
    } catch {
      message.error("Failed to fetch languages");
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  // Show modal to add
  const showModal = () => {
    setEditingRow(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Edit language
  const handleEdit = (record) => {
    setEditingRow(record);
    form.setFieldsValue({ languageName: record.languageName });
    setModalVisible(true);
  };

  // Delete language
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      setLanguages(prev => prev.filter(lang => lang.languageId !== id));
      message.success("Language deleted");
    } catch {
      message.error("Failed to delete language");
    }
  };

  // Add or update language
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { languageName } = values;

      if (editingRow) {
        const updatedLanguage = { languageId: editingRow.languageId, languageName };
        await axios.put(`${baseURL}/${editingRow.languageId}`, updatedLanguage);
        setLanguages(prev => prev.map(lang => lang.languageId === editingRow.languageId ? updatedLanguage : lang));
        message.success("Language updated successfully");
      } else {
        const newLanguage = { languageName };
        await axios.post(baseURL, newLanguage);
        // Add optimistic UI update (optional)
        const tempId = Math.max(0, ...languages.map(l => l.languageId || 0)) + 1;
        setLanguages(prev => [...prev, { languageId: tempId, ...newLanguage }]);
        message.success("Language added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingRow(null);
    } catch {
      message.error("Failed to save language");
    }
  };

  const columns = [
    {
      title: "Language ID",
      dataIndex: "languageId",
      key: "languageId",
      width: "25%",
      sorter: (a, b) => a.languageId - b.languageId,
    },
    {
      title: "Language Name",
      dataIndex: "languageName",
      key: "languageName",
      width: "50%",
      sorter: (a, b) => a.languageName.localeCompare(b.languageName),
    },
    {
      title: "Actions",
      key: "actions",
      width: "25%",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12 }}>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.languageId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
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
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(27,67,50,0.15)",
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
          borderBottom: "3px solid #1b4332",
          paddingBottom: 10,
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
          Language List
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={showModal}
          style={{
            backgroundColor: "#1b4332",
            borderColor: "#1b4332",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 8,
            padding: "0 28px",
            boxShadow: "0 6px 20px rgba(27,67,50,0.4)",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15552f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1b4332")}
        >
          Add Language
        </Button>
      </div>

      <Table
        dataSource={languages}
        columns={columns}
        rowKey="languageId"
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

      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              color: "#1b4332",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            {editingRow ? "✏️ Edit Language" : "➕ Add Language"}
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
          backgroundColor: "#f2f6f2",
          padding: "32px 40px",
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
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item
            label="Language Name"
            name="languageName"
            rules={[{ required: true, message: "Please enter language name" }]}
          >
            <Input
              maxLength={50}
              placeholder="Enter language name"
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

      <style>
        {`
          .table-row-even {
            background-color: #fafcf9;
          }
          .table-row-odd {
            background-color: #e9f1e1;
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

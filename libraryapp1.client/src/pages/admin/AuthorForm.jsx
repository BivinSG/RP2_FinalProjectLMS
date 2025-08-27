import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Typography,
  Space,
  Divider,
} from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

export default function AuthorForm() {
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const baseURL = "https://localhost:7023/api/authors";

  useEffect(() => {
    axios.get(baseURL)
      .then(res => setAuthors(res.data))
      .catch(() => message.error("Failed to fetch authors"));
  }, []);

  const showModal = () => {
    setEditingRow(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRow(record);
    form.setFieldsValue({ authorName: record.authorName });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    axios.delete(`${baseURL}/${id}`)
      .then(() => {
        setAuthors(prev => prev.filter(a => a.authorId !== id));
        message.success("Author deleted");
      })
      .catch(() => message.error("Failed to delete author"));
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { authorName } = values;

      if (editingRow) {
        const updatedAuthor = {
          authorId: editingRow.authorId,
          authorName
        };

        await axios.put(`${baseURL}/${editingRow.authorId}`, updatedAuthor);
        setAuthors(prev =>
          prev.map(a =>
            a.authorId === editingRow.authorId ? updatedAuthor : a
          )
        );
        message.success("Author updated successfully");
      } else {
        const newAuthor = { authorName };
        await axios.post(baseURL, newAuthor);

        const tempId = Math.max(0, ...authors.map(a => a.authorId || 0)) + 1;
        setAuthors(prev => [...prev, { authorId: tempId, ...newAuthor }]);
        message.success("Author added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingRow(null);
    } catch (err) {
      console.error("Validation or API Error:", err);
      message.error("Failed to save author");
    }
  };

  const columns = [
    { title: 'Author ID', dataIndex: 'authorId', key: 'authorId', width: 100 },
    { title: 'Author Name', dataIndex: 'authorName', key: 'authorName' },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete?"
            onConfirm={() => handleDelete(record.authorId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto' }}>
  <Card
    bordered={false}
    style={{ borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
  >
    {/* Page Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
      <div>
        <Title level={2} style={{ margin: 0, color: '#1b4332', fontWeight: 700, letterSpacing: '1px' }}>
          Authors
        </Title>
        <Text style={{ fontSize: 16, color: '#395144', fontWeight: 500 }}>
          Manage all authors in your library
        </Text>
      </div>
      <Button
        type="primary"
        icon={<UserAddOutlined style={{ fontSize: 18 }} />}
        style={{
          backgroundColor: '#1b4332',
          borderColor: '#1b4332',
          fontSize: 16,
          fontWeight: 600,
          padding: '6px 18px',
          borderRadius: 8,
        }}
        onClick={showModal}
      >
        Add Author
      </Button>
    </div>

    <Divider />

    {/* Authors Table */}
    <Table
      dataSource={authors}
      columns={columns}
      rowKey="authorId"
      pagination={{ pageSize: 5 }}
      bordered
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        fontSize: 16,
        color: '#1b4332',
      }}
      rowClassName={() => 'custom-table-row'}
    />

    {/* Add/Edit Modal */}
    <Modal
      title={editingRow ? 'Edit Author' : 'Add Author'}
      open={modalVisible}
      onOk={handleOk}
      onCancel={() => {
        setModalVisible(false);
        form.resetFields();
        setEditingRow(null);
      }}
      okText={editingRow ? 'Update' : 'Add'}
      centered
      destroyOnClose
      okButtonProps={{ style: { backgroundColor: '#1b4332', borderColor: '#1b4332', fontWeight: 600 } }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label={<span style={{ fontSize: 16, fontWeight: 500, color: '#1b4332' }}>Author Name</span>}
          name="authorName"
          rules={[{ required: true, message: 'Please enter author name' }]}
        >
          <Input
            maxLength={50}
            placeholder="Enter author name"
            style={{ fontSize: 16, padding: '8px 12px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
</div>

  );
}

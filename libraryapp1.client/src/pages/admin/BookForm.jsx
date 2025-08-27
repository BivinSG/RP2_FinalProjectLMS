import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Popconfirm,
  Card,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const BookForm = () => {
  const [books, setBooks] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBook, setEditingBook] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, languagesRes, authorsRes, booksRes] =
        await Promise.all([
          axios.get("https://localhost:7023/api/category"),
          axios.get("https://localhost:7023/api/language"),
          axios.get("https://localhost:7023/api/authors"),
          axios.get("https://localhost:7023/api/book"),
        ]);

      setCategoryOptions(categoriesRes.data);
      setLanguageOptions(languagesRes.data);
      setAuthorOptions(authorsRes.data);

      // Just keep books as received; quantity is total number of copies
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
    } catch (error) {
      message.error("Failed to load data");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        bookId: editingBook ? editingBook.bookId : 0,
        bookTitle: values.bookTitle,
        quantity: values.quantity,
        pubYear: values.pubYear,
        categoryId: values.categoryId || null,
        languageId: values.languageId || null,
        keywords: values.keywords || "",
        summary: values.summary || "",
        authorId: values.authorId || null,
        coverpage: values.coverpage || "",
      };

      if (editingBook) {
        await axios.put(
          `https://localhost:7023/api/book/${editingBook.bookId}`,
          payload
        );
        message.success("Book updated successfully");
      } else {
        await axios.post("https://localhost:7023/api/book", payload);
        message.success("Book added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingBook(null);
      setPreviewImage("");
      fetchData();
    } catch (error) {
      message.error("Failed to save book");
    }
  };

  const handleEdit = (record) => {
    setEditingBook(record);
    setPreviewImage(record.coverpage || "");
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  //const handleDelete = async (bookId) => {
  //  try {
  //    await axios.delete(`https://localhost:7023/api/book/${bookId}`);
  //    message.success("Book deleted successfully");
  //    fetchData();
  //  } catch (error) {
  //    message.error("Failed to delete book");
  //  }
  //};

  const openAddBookModal = () => {
    setEditingBook(null);
    form.resetFields();
    setPreviewImage("");
    setModalVisible(true);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadProps = {
    beforeUpload: async (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Only images allowed!");
        return Upload.LIST_IGNORE;
      }
      setUploading(true);
      try {
        const base64 = await getBase64(file);
        form.setFieldsValue({ coverpage: base64 });
        setPreviewImage(base64);
      } catch {
        message.error("Failed to upload");
      }
      setUploading(false);
      return false;
    },
  };

  const columns = [
    { title: "Title", dataIndex: "bookTitle" },
    { title: "Quantity", dataIndex: "quantity" }, // just show number of copies
    { title: "Year", dataIndex: "pubYear" },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (id) =>
        categoryOptions.find((c) => c.categoryId === id)?.categoryName || "N/A",
    },
    {
      title: "Language",
      dataIndex: "languageId",
      render: (id) =>
        languageOptions.find((l) => l.languageId === id)?.languageName || "N/A",
    },
    {
      title: "Author",
      dataIndex: "authorId",
      render: (id) =>
        authorOptions.find((a) => a.authorId === id)?.authorName || "N/A",
    },
    { title: "Keywords", dataIndex: "keywords" },
    { title: "Summary", dataIndex: "summary" },
    {
      title: "Cover",
      dataIndex: "coverpage",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="cover"
            style={{
              width: 50,
              borderRadius: 6,
              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          {/*<Popconfirm*/}
          {/*  title="Delete this book?"*/}
          {/*  onConfirm={() => handleDelete(record.bookId)}*/}
          {/*>*/}
          {/*  <Button danger>Delete</Button>*/}
          {/*</Popconfirm>*/}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          overflow: "hidden",
          border: "1px solid #eee",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Card Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1b4332, #40916c)",
            padding: "20px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#fff", fontWeight: 700 }}>
            📖 Book Management
          </h2>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            style={{
              background: "#fff",
              color: "#1b4332",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            onClick={openAddBookModal}
          >
            Add Book
          </Button>
        </div>

        {/* Table */}
        <div style={{ padding: "24px 32px" }}>
          <Table
            dataSource={books}
            columns={columns}
            rowKey="bookId"
            pagination={{ pageSize: 6 }}
            bordered
            style={{ borderRadius: 10, background: "#fff" }}
            rowClassName={(_, idx) =>
              idx % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </div>
      </Card>

      {/* Modal */}
      <Modal
        open={modalVisible}
        title={
          <div style={{ textAlign: "center", fontWeight: 600, fontSize: 18 }}>
            {editingBook ? "Edit Book" : "Add New Book"}
          </div>
        }
        onCancel={() => {
          setModalVisible(false);
          setEditingBook(null);
          form.resetFields();
          setPreviewImage("");
        }}
        onOk={() => form.submit()}
        width={950}
        centered
        bodyStyle={{ background: "#f9f9f9", padding: 24 }}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Left Card */}
            <Card
              size="small"
              title="📖 Book Info"
              style={{
                borderRadius: 10,
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <Form.Item name="bookTitle" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Book Title" />
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <Input type="number" min="1" />
              </Form.Item>
              <Form.Item name="pubYear" label="Publishing Year" rules={[{ required: true }]}>
                <Input type="number" min="1000" max={new Date().getFullYear()} />
              </Form.Item>
              <Form.Item name="keywords" label="Keywords" rules={[{ required: true }]}>
                <Input placeholder="Enter keywords" />
              </Form.Item>
              <Form.Item name="summary" label="Summary" rules={[{ required: true }]}>
                <Input.TextArea rows={3} placeholder="Book summary..." />
              </Form.Item>
            </Card>

            {/* Right Card */}
            <Card
              size="small"
              title="🧾 Metadata & Cover"
              style={{
                borderRadius: 10,
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
              }}
            >
              <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  {categoryOptions.map((c) => (
                    <Option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="languageId" label="Language" rules={[{ required: true }]}>
                <Select placeholder="Select language">
                  {languageOptions.map((l) => (
                    <Option key={l.languageId} value={l.languageId}>
                      {l.languageName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="authorId" label="Author" rules={[{ required: true }]}>
                <Select placeholder="Select author">
                  {authorOptions.map((a) => (
                    <Option key={a.authorId} value={a.authorId}>
                      {a.authorName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="coverpage" hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Cover Page" required>
                <Upload
                  {...uploadProps}
                  listType="picture"
                  maxCount={1}
                  accept="image/*"
                  beforeUpload={uploadProps.beforeUpload}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={!!previewImage}
                  >
                    {previewImage ? "Image Uploaded" : "Upload Image"}
                  </Button>
                </Upload>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      marginTop: 12,
                      width: 100,
                      border: "1px solid #eee",
                      borderRadius: 6,
                    }}
                  />
                )}
              </Form.Item>
            </Card>
          </div>
        </Form>
      </Modal>

      {/* Custom Styles */}
      <style>
        {`
          .table-row-light {
            background: #fff;
          }
          .table-row-dark {
            background: #f9f9f9;
          }
          .ant-table-thead > tr > th {
            background: #e6f4ea !important;
            color: #1b4332;
            font-weight: 600;
          }
          .ant-modal-content {
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </div>
  );
};

export default BookForm;

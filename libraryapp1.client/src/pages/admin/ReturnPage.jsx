import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Button,
  message,
  Tag,
  Spin,
  Modal,
  InputNumber,
  Form,
  Typography,
  Space,
  Card,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

export default function ReturnPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLoan, setCurrentLoan] = useState(null);
  const [payingFine, setPayingFine] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const fetchActiveUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get("https://localhost:7023/api/return/active-users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
      message.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchLoansByUser = async (userId) => {
    try {
      setLoadingLoans(true);
      const res = await axios.get(
        `https://localhost:7023/api/return/user-loans/${userId}`
      );

      const loansWithFine = res.data.map((loan) => {
        const dueDate = dayjs(loan.expiryDate);
        const today = dayjs();

        const overdueDays = today.isAfter(dueDate, "day")
          ? today.diff(dueDate, "day")
          : 0;
        const fineAmount = overdueDays * 10;

        return {
          ...loan,
          fineAmount,
          finePaid: loan.finePaid || false,
        };
      });

      setLoans(loansWithFine);
    } catch (err) {
      console.error("Failed to load loans:", err);
      message.error("Failed to load loans");
      setLoans([]);
    } finally {
      setLoadingLoans(false);
    }
  };

  const handleUserChange = (value) => {
    setSelectedUserId(value);
    fetchLoansByUser(value);
  };

  const handleReturn = async (loanId) => {
    try {
      await axios.post(`https://localhost:7023/api/return/return/${loanId}`);
      message.success("Book returned successfully");
      fetchLoansByUser(selectedUserId);
    } catch (err) {
      console.error("Failed to return book:", err);
      message.error("Failed to return book");
    }
  };

  const openPayFineModal = (loan) => {
    setCurrentLoan(loan);
    form.setFieldsValue({ amount: loan.fineAmount });
    setIsModalVisible(true);
  };

  const handlePayFine = async () => {
    try {
      const values = await form.validateFields();
      setPayingFine(true);

      if (!currentLoan) {
        message.error("Loan not found");
        setPayingFine(false);
        return;
      }

      const payload = {
        Amount: values.amount,
      };

      await axios.post(
        `https://localhost:7023/api/return/pay-fine/${currentLoan.loanId}`,
        payload
      );

      message.success("Fine paid successfully");
      setIsModalVisible(false);

      // Update loan in state
      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.loanId === currentLoan.loanId
            ? { ...loan, finePaid: true, fineAmount: 0 }
            : loan
        )
      );
    } catch (err) {
      console.error("Failed to pay fine:", err);
      message.error("Failed to pay fine");
    } finally {
      setPayingFine(false);
    }
  };

  const totalFineDue = loans.reduce(
    (acc, loan) => (loan.finePaid ? acc : acc + loan.fineAmount),
    0
  );

  const columns = [
    {
      title: "Book Title",
      dataIndex: "bookTitle",
      key: "bookTitle",
      sorter: (a, b) => a.bookTitle.localeCompare(b.bookTitle),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Issue Date",
      dataIndex: "dateOfPurchase",
      key: "dateOfPurchase",
      sorter: (a, b) => dayjs(a.dateOfPurchase).unix() - dayjs(b.dateOfPurchase).unix(),
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Due Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) => dayjs(a.expiryDate).unix() - dayjs(b.expiryDate).unix(),
      render: (text) => {
        const isOverdue = dayjs(text).isBefore(dayjs(), "day");
        return (
          <Tag color={isOverdue ? "red" : "green"}>
            {dayjs(text).format("YYYY-MM-DD")} {isOverdue ? "(Overdue)" : ""}
          </Tag>
        );
      },
    },
    {
      title: "Returned",
      dataIndex: "isReturned",
      key: "isReturned",
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isReturned === value,
      render: (returned) => (returned ? "Yes" : "No"),
    },
    {
      title: "Fine Due (₹)",
      dataIndex: "fineAmount",
      key: "fineAmount",
      sorter: (a, b) => a.fineAmount - b.fineAmount,
      render: (fine, record) => {
        if (record.finePaid) return <Tag color="green">Paid</Tag>;
        return fine > 0 ? (
          <Text type="danger" strong>
            {fine.toFixed(2)}
          </Text>
        ) : (
          "0.00"
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            // Disabled if there is a fine that is not yet paid
            disabled={record.isReturned || (record.fineAmount > 0 && !record.finePaid)}
            onClick={() => handleReturn(record.loanId)}
          >
            Return
          </Button>

          {!record.isReturned && record.fineAmount > 0 && !record.finePaid && (
            <Button type="default" onClick={() => openPayFineModal(record)}>
              Pay Fine
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 30, background: "#fff", borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.1)" }}>
      <Title level={2} style={{ textAlign: "center", color: "#1890ff", marginBottom: 30 }}>
        Return Issued Books
      </Title>

      <Card style={{ marginBottom: 20 }} bodyStyle={{ padding: 20 }} bordered={false} hoverable>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Text strong>Select Active User</Text>
          <Select
            showSearch
            placeholder="Select active user"
            optionFilterProp="children"
            style={{ width: "100%", maxWidth: 350 }}
            onChange={handleUserChange}
            loading={loadingUsers}
            allowClear
            size="large"
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            {users.map((u) => (
              <Option key={u.userId} value={u.userId}>
                {u.name}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {loadingLoans ? (
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {selectedUserId && loans.length > 0 && (
            <Card style={{ marginBottom: 20 }} bodyStyle={{ padding: 16 }} bordered={false} hoverable>
              <Text strong style={{ fontSize: 16 }}>
                Total Outstanding Fine Due:{" "}
                <Text type={totalFineDue > 0 ? "danger" : "success"} strong>
                  ₹{totalFineDue.toFixed(2)}
                </Text>
              </Text>
            </Card>
          )}

          <Table
            rowKey="loanId"
            columns={columns}
            dataSource={loans}
            pagination={{ pageSize: 6 }}
            locale={{
              emptyText: selectedUserId ? "No active loans" : "Select a user",
            }}
            bordered
            scroll={{ x: 800 }}
          />
        </>
      )}

      <Modal
        title="Pay Fine"
        open={isModalVisible}
        onOk={handlePayFine}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={payingFine}
        okText="Pay"
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="payFineForm">
          <Form.Item
            name="amount"
            label="Fine Amount (₹)"
            rules={[
              { required: true, message: "Please input the fine amount" },
              { type: "number", min: 0.01, message: "Amount must be positive" },
            ]}
          >
            <InputNumber
              min={0.01}
              style={{ width: "100%" }}
              placeholder="Enter fine amount"
              precision={2}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

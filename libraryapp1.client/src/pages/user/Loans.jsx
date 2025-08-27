import { useState, useEffect, useCallback } from "react";
import { GetIdFromLocalStorage } from "../../utils/helper";
import {
  Table,
  Typography,
  Tag,
  Card,
  Row,
  Col,
  Spin,
  Button,
  message,
} from "antd";

const { Title, Text } = Typography;

const Loans = () => {
  const [userId] = useState(() => GetIdFromLocalStorage());
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLoanData = useCallback(async () => {
    try {
      setLoading(true);
      // ✅ Get all loans instead of passing userId
      const response = await fetch("https://localhost:7023/api/loan");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const allLoans = await response.json();

      // ✅ Filter by current userId on frontend
      const userLoans = Array.isArray(allLoans)
        ? allLoans.filter((loan) => loan.userId === userId)
        : [];

      setLoanData(userLoans);
    } catch (error) {
      console.error("Error fetching loan data:", error);
      message.error("Failed to load loans");
      setLoanData([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLoanData();
  }, [fetchLoanData]);

  // Transform into complete activity report
  const activities = loanData
    .map((item) => ({
      key: item.loanId,
      bookTitle: item.bookTitle,
      copyId: item.copyId,
      dateOfIssue: item.dateOfPurchase,
      expiryDate: item.expiryDate,
      dateOfReturn:
        item.dateOfReturn && item.dateOfReturn !== "0001-01-01"
          ? item.dateOfReturn
          : null,
      fineAmount: item.fineAmount || 0,
      status:
        item.dateOfReturn && item.dateOfReturn !== "0001-01-01"
          ? "Returned"
          : "Issued",
      lastActivity:
        item.dateOfReturn && item.dateOfReturn !== "0001-01-01"
          ? item.dateOfReturn
          : item.dateOfPurchase,
    }))
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

  const activityColumns = [
    {
      title: "Book Title",
      dataIndex: "bookTitle",
      key: "bookTitle",
      render: (text) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title: "Copy ID",
      dataIndex: "copyId",
      key: "copyId",
    },
    {
      title: "Date of Issue",
      dataIndex: "dateOfIssue",
      key: "dateOfIssue",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (text) => <Text type="secondary">{text || "N/A"}</Text>,
    },
    {
      title: "Date of Return",
      dataIndex: "dateOfReturn",
      key: "dateOfReturn",
      render: (text) =>
        text ? (
          <Tag color="green">{text}</Tag>
        ) : (
          <Tag color="orange">Not Returned</Tag>
        ),
    },
    {
      title: "Fine Amount",
      dataIndex: "fineAmount",
      key: "fineAmount",
      render: (amt) => <Text>{amt ? `₹${amt}` : "₹0.00"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Returned" ? (
          <Tag color="blue">Returned</Tag>
        ) : (
          <Tag color="orange">Issued</Tag>
        ),
    },
  ];

  return (
    <div
      style={{ padding: "20px 40px", background: "#f0f2f5", minHeight: "100vh" }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: "32px" }}>
        <Col>
          <Title level={1} style={{ color: "#1f2937", margin: 0 }}>
            User Activity Report
          </Title>
          <Text type="secondary">Complete issue and return history</Text>
        </Col>
        <Col>
          <Button type="primary" onClick={fetchLoanData}>
            Refresh
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Card bordered>
          <Title level={3}>Activity History</Title>
          {activities.length === 0 ? (
            <Text type="secondary">No activity found</Text>
          ) : (
            <Table
              dataSource={activities}
              columns={activityColumns}
              pagination={{ pageSize: 5 }}
              bordered
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Loans;

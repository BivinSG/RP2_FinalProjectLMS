import { useState, useEffect } from "react";
import { GetIdFromLocalStorage } from "../../utils/helper";
import { Table, Typography, Tag, Spin, Alert } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Fines = () => {
  const [userId] = useState(() => GetIdFromLocalStorage());
  const [fineData, setFineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFineData = async () => {
      try {
        const response = await fetch(
          `https://localhost:7023/api/return/user-loans/${userId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Calculate fine dynamically
        const loansWithFine = data.map((loan) => {
          const dueDate = dayjs(loan.expiryDate);
          const today = dayjs();
          const overdueDays = today.isAfter(dueDate, "day") ? today.diff(dueDate, "day") : 0;
          const fineAmount = overdueDays * 10; // ₹10 per day

          return {
            ...loan,
            fineAmount,
            paidAmount: loan.paidAmount || 0, // If backend has paidAmount
          };
        });

        setFineData(loansWithFine);
        setError(null);
      } catch (error) {
        console.error("Error fetching fine data:", error);
        setError(error.message);
        setFineData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFineData();
  }, [userId]);

  const columns = [
    {
      title: "Loan ID",
      dataIndex: "loanId",
      key: "loanId",
      sorter: (a, b) => a.loanId - b.loanId,
    },
    {
      title: "Book Title",
      dataIndex: "bookTitle",
      key: "bookTitle",
      render: (text) => <Text strong>{text || "N/A"}</Text>,
      sorter: (a, b) => (a.bookTitle || "").localeCompare(b.bookTitle || ""),
    },
    {
      title: "Date of Purchase",
      dataIndex: "dateOfPurchase",
      key: "dateOfPurchase",
      sorter: (a, b) =>
        new Date(a.dateOfPurchase || 0) - new Date(b.dateOfPurchase || 0),
      render: (text) => (text ? dayjs(text).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) =>
        new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0),
      render: (text) => (
        <Tag color={text && dayjs(text).isBefore(dayjs(), "day") ? "red" : "green"}>
          {text ? dayjs(text).format("YYYY-MM-DD") : "-"}
        </Tag>
      ),
    },
    {
      title: "Return Status",
      dataIndex: "isReturned",
      key: "isReturned",
      render: (isReturned) => (
        <Tag color={isReturned ? "green" : "red"}>
          {isReturned ? "Returned" : "Not Returned"}
        </Tag>
      ),
    },
    {
      title: "Fine Amount (₹)",
      dataIndex: "fineAmount",
      key: "fineAmount",
      render: (amount) => (
        <span style={{ color: amount > 0 ? "#ff4d4f" : "#52c41a", fontWeight: amount > 0 ? "bold" : "normal" }}>
          ₹{amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.fineAmount - b.fineAmount,
    },
    {
      title: "Paid Amount (₹)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (amount) => (
        <span style={{ color: "#1890ff", fontWeight: "bold" }}>
          ₹{amount.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.paidAmount - b.paidAmount,
    },
    {
      title: "Outstanding (₹)",
      key: "outstanding",
      render: (_, record) => {
        const outstanding = record.fineAmount - record.paidAmount;
        return (
          <Tag color={outstanding > 0 ? "red" : "green"}>
            ₹{outstanding.toFixed(2)}
          </Tag>
        );
      },
      sorter: (a, b) => (a.fineAmount - a.paidAmount) - (b.fineAmount - b.paidAmount),
    },
  ];

  const dataSource = fineData.map((item) => ({ ...item, key: item.loanId }));

  return (
    <div
      style={{
        margin: "20px auto",
        maxWidth: 1200,
        padding: 24,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <Title level={1} style={{ fontSize: 36, fontWeight: 300, color: "#262626", marginBottom: 32 }}>
        Fines
      </Title>

      {error && (
        <Alert
          type="error"
          message="Failed to load fines"
          description={error}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 8, showSizeChanger: true, pageSizeOptions: ["8", "16", "32"] }}
          scroll={{ x: "max-content" }}
          bordered
          size="middle"
          locale={{
            emptyText: (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#999", fontSize: 18 }}>
                <div style={{ fontSize: 64, marginBottom: 16, color: "#d9d9d9" }}>📚</div>
                No fines data available
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default Fines;

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Rate,
  Pagination,
  Button,
  Typography,
  Space,
  Tag,
  Avatar,
  Spin,
  Alert,
  Image,
} from "antd";
import { ArrowLeftOutlined, UserOutlined, BookOutlined, CalendarOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const BookDetails = ({ id, onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 4;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookResponse = await axios.get(`https://localhost:7023/api/book/${id}`);
        setBook(bookResponse.data);
        const reviewsResponse = await axios.get(`https://localhost:7023/api/bookreview/${id}`);
        setReviews(reviewsResponse.data);
      } catch {
        setError("Failed to load book details or reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;
  if (error || !book)
    return (
      <div style={{ padding: 24, maxWidth: 600, margin: "auto" }}>
        <Alert message={error || "Book not found"} type="error" showIcon style={{ marginBottom: 16 }} />
        {onBack && <Button icon={<ArrowLeftOutlined />} onClick={onBack}>Back</Button>}
      </div>
    );

  const pagedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "auto", background: "#f9fafb" }}>
      {onBack && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ marginBottom: 20, fontWeight: 600, fontSize: 16, color: "#1b4332" }}
        >
          Back to Books
        </Button>
      )}

      <Row gutter={[24, 24]}>
        {/* Left Panel - Book Info */}
        <Col xs={24} md={8}>
          <Card
            hoverable
            cover={
              <Image
                src={book.coverpage || "/placeholder-book.jpg"}
                alt={book.bookTitle}
                preview={false}
                style={{ objectFit: "cover", height: 380, width: "100%", borderRadius: 8 }}
                fallback="/placeholder-book.jpg"
              />
            }
            style={{ borderRadius: 12, boxShadow: "0 12px 24px rgba(27, 67, 50, 0.15)" }}
          >
            <Title level={3} style={{ marginTop: 12 }}>{book.bookTitle}</Title>
            <Text style={{ fontSize: 16, color: "#555" }}>{book.authorName || `Author #${book.authorId}`}</Text>

            <div style={{ marginTop: 16 }}>
              <Rate allowHalf disabled value={parseFloat(avgRating)} />
              <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: 600 }}>{avgRating} / 5</Text>
            </div>

            <div style={{ marginTop: 16 }}>
              <Tag color="blue" icon={<BookOutlined />}>{book.categoryName || `#${book.categoryId}`}</Tag>
              <Tag color="green" icon={<CalendarOutlined />}>{book.languageName || `#${book.languageId}`}</Tag>
            </div>
          </Card>
        </Col>

        {/* Right Panel - Book Details & Reviews */}
        <Col xs={24} md={16}>
          {/* Book Details */}
          <Card
            title="Book Information"
            style={{ borderRadius: 12, marginBottom: 24, boxShadow: "0 8px 20px rgba(27, 67, 50, 0.1)" }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Row>
                <Col span={8}><Text strong>Publishing Year:</Text></Col>
                <Col span={16}><Text>{book.pubYear || "N/A"}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>Quantity:</Text></Col>
                <Col span={16}><Text>{book.quantity || 0}</Text></Col>
              </Row>
              <Row>
                <Col span={8}><Text strong>Available Copies:</Text></Col>
                <Col span={16}><Text>{book.availableQuantity || 0}</Text></Col>
              </Row>
              {book.summary && (
                <Row>
                  <Col span={24}><Text strong>Summary:</Text></Col>
                  <Col span={24}><Text style={{ whiteSpace: "pre-wrap" }}>{book.summary}</Text></Col>
                </Row>
              )}
            </Space>
          </Card>

          {/* Reviews */}
          <Card
            title={`User Reviews (${reviews.length})`}
            style={{ borderRadius: 12, boxShadow: "0 8px 16px rgba(27, 67, 50, 0.1)" }}
          >
            {!reviews.length ? (
              <Text type="secondary" style={{ display: "block", textAlign: "center", padding: 40 }}>
                No reviews yet.
              </Text>
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {pagedReviews.map((review) => (
                    <Col xs={24} sm={12} key={review.reviewId}>
                      <Card
                        size="small"
                        hoverable
                        style={{
                          borderRadius: 12,
                          boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                          height: "160px",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Space>
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text strong>{review.name || "Anonymous"}</Text>
                          </Space>
                          <Rate size="small" disabled value={review.rating} />
                          <Text style={{ fontSize: 14, color: "#555", whiteSpace: "pre-wrap" }}>
                            {review.review}
                          </Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {reviews.length > pageSize && (
                  <div style={{ marginTop: 24, textAlign: "center" }}>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={reviews.length}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      style={{ userSelect: "none" }}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Custom CSS for better visuals */}
      <style>{`
        .ant-pagination-item-active {
          background-color: #1b4332 !important;
          border-color: #1b4332 !important;
        }
        .ant-pagination-item-active a { color: white !important; }
        .ant-pagination-item:hover { border-color: #1b4332 !important; }
      `}</style>
    </div>
  );
};

export default BookDetails;
  
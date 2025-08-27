import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Tag, Space, Spin } from "antd";
import axios from "axios";

const ReservationsUI = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call 3 APIs: books, authors, available copies
        const [booksRes, authorsRes, copiesRes] = await Promise.all([
          axios.get("https://localhost:7023/api/book"),
          axios.get("https://localhost:7023/api/authors"),
          axios.get("https://localhost:7023/api/copy/available"),
        ]);

        const authors = authorsRes.data;
        const copies = copiesRes.data;

        // Map books + authors + copies
        const booksWithDetails = booksRes.data.map((book) => {
          const author = authors.find((a) => a.authorId === book.authorId);

          // Count available copies for this book
          const availableCount = copies.filter(
            (c) => c.bookId === book.bookId
          ).length;

          return {
            book_id: book.bookId,
            title: book.bookTitle,
            author: author ? author.authorName : "Unknown",
            year: book.pubYear,
            cover:
              book.coverpage ||
              "https://via.placeholder.com/200x250?text=No+Image",
            copies: availableCount, // just number, not copyIds
          };
        });

        setBooks(booksWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReserve = (book_id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.book_id === book_id && b.copies > 0
          ? { ...b, copies: b.copies - 1 }
          : b
      )
    );
  };

  const handleReturn = (book_id) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.book_id === book_id ? { ...b, copies: b.copies + 1 } : b
      )
    );
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );

  return (
    <Row gutter={[24, 24]}>
      {books.map((book) => (
        <Col xs={24} sm={12} md={8} lg={6} key={book.book_id}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            cover={
              <img
                alt={book.title}
                src={book.cover}
                style={{ height: 250, objectFit: "cover", borderRadius: "8px" }}
              />
            }
          >
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: "4px 0" }}>
                <strong>Book ID:</strong> {book.book_id}
              </p>
              <h3 style={{ marginBottom: 6 }}>{book.title}</h3>
              <p style={{ margin: "4px 0" }}>
                <strong>Author:</strong> {book.author}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Year:</strong> {book.year}
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Copies Available:</strong> {book.copies}
              </p>
            </div>

            <div style={{ marginBottom: 12 }}>
              {book.copies > 0 ? (
                <Tag color="green">{book.copies} Copies Available</Tag>
              ) : (
                <Tag color="red">No Copies Available</Tag>
              )}
            </div>

            <Space>
              <Button
                type="primary"
                disabled={book.copies === 0}
                onClick={() => handleReserve(book.book_id)}
              >
                Reserve
              </Button>
              {/*<Button type="default" onClick={() => handleReturn(book.book_id)}>*/}
              {/*  Return*/}
              {/*</Button>*/}
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ReservationsUI;

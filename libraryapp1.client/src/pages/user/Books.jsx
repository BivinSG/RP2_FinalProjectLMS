import { useState, useEffect, useMemo } from "react";
import {
    Card,
    Col,
    Row,
    Pagination,
    Spin,
    Typography,
    Button,
    Badge,
    Input,
    Checkbox,
    Space,
    Modal,
} from "antd";
import { ArrowRightOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import axios from "axios";
import BookDetails from "./BookDetails";

const { Text, Title } = Typography;

const Books = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const pageSize = 12;

    useEffect(() => {
        const fetchBooksData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://localhost:7023/api/book`);
                setData(response.data || []);
            } catch (err) {
                setError("Failed to fetch book data");
            } finally {
                setLoading(false);
            }
        };
        fetchBooksData();
    }, []);

    const { uniqueCategories, uniqueAuthors } = useMemo(() => {
        const categories = new Set();
        const authors = new Set();
        data.forEach((book) => {
            if (book.categoryName) categories.add(book.categoryName);
            else if (book.categoryId) categories.add(`Category ID: ${book.categoryId}`);
            if (book.authorName) authors.add(book.authorName);
            else if (book.authorId) authors.add(`Author ID: ${book.authorId}`);
        });
        return {
            uniqueCategories: Array.from(categories).sort(),
            uniqueAuthors: Array.from(authors).sort(),
        };
    }, [data]);

    const filteredData = useMemo(() => {
        let filtered = data;
        if (searchTerm) filtered = filtered.filter((book) => book.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedCategories.length > 0)
            filtered = filtered.filter((book) => selectedCategories.includes(book.categoryName || `Category ID: ${book.categoryId}`));
        if (selectedAuthors.length > 0)
            filtered = filtered.filter((book) => selectedAuthors.includes(book.authorName || `Author ID: ${book.authorId}`));
        return filtered;
    }, [data, searchTerm, selectedCategories, selectedAuthors]);

    const startIndex = (currentPage - 1) * pageSize;
    const currentData = filteredData.slice(startIndex, startIndex + pageSize);

    useEffect(() => setCurrentPage(1), [searchTerm, selectedCategories, selectedAuthors]);

    const clearAllFilters = () => {
        setSearchTerm("");
        setSelectedCategories([]);
        setSelectedAuthors([]);
    };

    const hasActiveFilters = searchTerm || selectedCategories.length > 0 || selectedAuthors.length > 0;

    if (selectedBookId) return <BookDetails id={selectedBookId} onBack={() => setSelectedBookId(null)} />;
    if (loading) return <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}><Spin size="large" /></div>;
    if (error) return <div style={{ textAlign: "center", padding: 50 }}><Text type="secondary">{error}</Text></div>;

    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: 24 }}>
            <div style={{ maxWidth: 1400, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>Books</Title>
                    <Space wrap>
                        <Input
                            placeholder="Search books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            prefix={<SearchOutlined />}
                            allowClear
                            style={{ width: 300, borderRadius: 10 }}
                            size="large"
                        />
                        <Button type={hasActiveFilters ? "primary" : "default"} icon={<FilterOutlined />} onClick={() => setIsFilterModalOpen(true)} style={{ borderRadius: 10 }}>
                            Filter {hasActiveFilters && <Badge count={selectedCategories.length + selectedAuthors.length} offset={[5, -5]} />}
                        </Button>
                    </Space>
                </div>

                {/* Books Grid */}
                <Row gutter={[24, 24]}>
                    {currentData.map((book) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={book.bookId}>
                            <Card
                                hoverable
                                onClick={() => setSelectedBookId(book.bookId)}
                                bordered={false}
                                style={{
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    cursor: "pointer",
                                    background: "#fff",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                                cover={
                                    <div style={{ height: 220, overflow: "hidden", position: "relative" }}>
                                        <img
                                            src={book.coverpage || "/placeholder-book.jpg"}
                                            alt={book.bookTitle}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "scale 0.3s" }}
                                            onError={(e) => e.target.src = "/placeholder-book.jpg"}
                                        />
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                                    </div>
                                }
                            >
                                <Text strong style={{ fontSize: 16, display: "block", marginBottom: 4 }}>{book.bookTitle}</Text>
                                <Text type="secondary" style={{ display: "block", marginBottom: 2 }}>{book.authorName || `Author ID: ${book.authorId}`}</Text>
                                <Text type="secondary" style={{ fontSize: 12, textTransform: "uppercase" }}>{book.categoryName || `Category ID: ${book.categoryId}`}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredData.length > pageSize && (
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <Pagination current={currentPage} total={filteredData.length} pageSize={pageSize} showSizeChanger={false} onChange={setCurrentPage} size="large" />
                    </div>
                )}

                {/* Filter Modal */}
                <Modal
                    title="Filter Books"
                    open={isFilterModalOpen}
                    onCancel={() => setIsFilterModalOpen(false)}
                    onOk={() => setIsFilterModalOpen(false)}
                    width={600}
                    centered
                    footer={[
                        <Button key="clear" onClick={clearAllFilters} disabled={!hasActiveFilters}>Clear All</Button>,
                        <Button key="apply" type="primary" onClick={() => setIsFilterModalOpen(false)}>Apply Filters</Button>
                    ]}
                >
                    <Row gutter={[24, 20]}>
                        {uniqueCategories.length > 0 && (
                            <Col xs={24} md={12}>
                                <Text strong>Categories</Text>
                                <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eaeaea", borderRadius: 10, padding: 12, background: "#fafafa", marginTop: 8 }}>
                                    <Checkbox.Group value={selectedCategories} onChange={setSelectedCategories} style={{ width: "100%" }}>
                                        <Space direction="vertical">
                                            {uniqueCategories.map(cat => <Checkbox key={cat} value={cat}>{cat}</Checkbox>)}
                                        </Space>
                                    </Checkbox.Group>
                                </div>
                            </Col>
                        )}
                        {uniqueAuthors.length > 0 && (
                            <Col xs={24} md={12}>
                                <Text strong>Authors</Text>
                                <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eaeaea", borderRadius: 10, padding: 12, background: "#fafafa", marginTop: 8 }}>
                                    <Checkbox.Group value={selectedAuthors} onChange={setSelectedAuthors} style={{ width: "100%" }}>
                                        <Space direction="vertical">
                                            {uniqueAuthors.map(auth => <Checkbox key={auth} value={auth}>{auth}</Checkbox>)}
                                        </Space>
                                    </Checkbox.Group>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Modal>
            </div>
        </div>
    );
};

export default Books;

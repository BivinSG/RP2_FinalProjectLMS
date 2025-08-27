import { useState, useEffect } from 'react';
import { GetIdFromLocalStorage } from '../../utils/helper';
import { Table, Typography, Rate, Button, Modal, Form, Input, Select, message, Tag, Space, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const Reviews = () => {
    const [userId] = useState(() => GetIdFromLocalStorage());
    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [eligibleBooks, setEligibleBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);

    useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const response = await fetch(`https://localhost:7023/api/bookreview/user/${userId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setReviewData(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching review data:', error);
                setError(error.message);
                setReviewData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReviewData();
    }, [userId]);

    const fetchEligibleBooks = async () => {
        setBooksLoading(true);
        try {
            const response = await fetch(`https://localhost:7023/api/bookreview/to-review/${userId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const uniqueBooks = [];
            const seenTitles = new Set();
            data.forEach(book => {
                if (!seenTitles.has(book.title)) {
                    seenTitles.add(book.title);
                    uniqueBooks.push(book);
                }
            });
            setEligibleBooks(uniqueBooks);
        } catch (error) {
            console.error('Error fetching eligible books:', error);
            message.error('Failed to fetch eligible books');
            setEligibleBooks([]);
        } finally {
            setBooksLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        fetchEligibleBooks();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEligibleBooks([]);
    };

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const reviewPayload = {
                userid: parseInt(userId),
                bookId: values.bookId,
                review: values.review,
                rating: values.rating
            };
            const response = await fetch('https://localhost:7023/api/bookreview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewPayload),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            message.success('Review added successfully!');
            setIsModalVisible(false);
            form.resetFields();
            setEligibleBooks([]);

            // Refresh
            setLoading(true);
            const fetchResponse = await fetch(`https://localhost:7023/api/bookreview/user/${userId}`);
            if (fetchResponse.ok) setReviewData(await fetchResponse.json());
            setLoading(false);
        } catch (error) {
            console.error('Error adding review:', error);
            message.error('Failed to add review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Book',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text strong>{text}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.bookId}</Text>
                </div>
            ),
        },
        {
            title: 'Review',
            dataIndex: 'review',
            key: 'review',
            render: (text) => <Text>{text || 'N/A'}</Text>,
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: '16px' }} />,
        },
    ];

    const dataSource = reviewData.map((item) => ({ ...item, key: item.reviewId }));

    return (
        <div style={{ margin: '40px auto', maxWidth: '1000px', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                <Title level={1} style={{ fontSize: '36px', fontWeight: '500', margin: 0 }}>
                    Your Reviews
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    style={{ marginLeft: 'auto', borderRadius: '8px', height: '42px' }}
                >
                    Add Review
                </Button>
            </div>

            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={() => 'review-row'}
                style={{ borderRadius: '8px', overflow: 'hidden' }}
                locale={{
                    emptyText: (
                        <div style={{ padding: '60px 0', textAlign: 'center', color: '#999' }}>
                            <div style={{ fontSize: '48px' }}>📚</div>
                            <Text>No reviews yet</Text>
                        </div>
                    )
                }}
            />

            <Modal
                title="Add New Review"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={650}
                bodyStyle={{ borderRadius: '8px', padding: '24px' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    <Form.Item
                        label="Select Book"
                        name="bookId"
                        rules={[{ required: true, message: 'Please select a book!' }]}
                    >
                        <Select
                            placeholder="Select a book to review"
                            loading={booksLoading}
                            style={{ width: '100%' }}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {eligibleBooks.map((book) => (
                                <Option key={book.bookId || book.id} value={book.bookId || book.id}>
                                    {book.title || book.bookTitle || book.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Review"
                        name="review"
                        rules={[
                            { required: true, message: 'Please enter your review!' },
                            { min: 10, message: 'Review must be at least 10 characters long!' }
                        ]}
                    >
                        <Input.TextArea rows={4} showCount maxLength={500} placeholder="Write your review..." />
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                        rules={[{ required: true, message: 'Please provide a rating!' }]}
                    >
                        <Rate style={{ fontSize: '24px' }} />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Add Review
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Reviews;

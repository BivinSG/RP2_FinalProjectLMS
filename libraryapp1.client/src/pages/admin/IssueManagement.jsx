import React, { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Button,
    Modal,
    Form,
    DatePicker,
    Select,
    message,
    Space,
    Spin,
    Typography,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

export default function IssueManagement() {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [issuedBooks, setIssuedBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchText, setSearchText] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [bookError, setBookError] = useState('');
    const [currentEditingLoan, setCurrentEditingLoan] = useState(null);

    // ✅ New state for status filter
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchDropdownData();
        fetchIssuedBooks();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [usersRes, booksRes] = await Promise.all([
                axios.get('https://localhost:7023/api/user'),
                axios.get('https://localhost:7023/api/loan/available-copies'),
            ]);

            const activeUsers = Array.isArray(usersRes.data)
                ? usersRes.data.filter(
                    (user) =>
                        user.isActive &&
                        user.isActive.toLowerCase() === 'yes' &&
                        user.role &&
                        user.role.toLowerCase() !== 'admin'
                )
                : [];
            setUsers(activeUsers);

            const availableBooks = Array.isArray(booksRes.data) ? booksRes.data : [];
            setBooks(availableBooks);
        } catch (err) {
            console.error(err);
            message.error('Failed to load dropdown data');
            setUsers([]);
            setBooks([]);
        }
    };

    const fetchIssuedBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://localhost:7023/api/loan');
            const booksData = Array.isArray(res.data) ? res.data : [];
            setIssuedBooks(booksData);
            setFilteredBooks(booksData);
        } catch (err) {
            console.error(err);
            message.error('Failed to load issued books');
            setIssuedBooks([]);
            setFilteredBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueSubmit = async (values) => {
        setBookError('');

        const selectedBook = books.find((b) => String(b.copyId) === values.bookId);
        if (!selectedBook || selectedBook.availableCopies <= 0) {
            setBookError('Book Copy not available');
            return;
        }

        const payload = {
            UserId: values.userId,
            CopyId: values.bookId,
            DateOfPurchase: values.issueDate.format('YYYY-MM-DD'),
            ExpiryDate: values.dueDate.format('YYYY-MM-DD'),
        };

        try {
            await axios.post('https://localhost:7023/api/loan/issue', payload);
            message.success('Book issued successfully');
            setIssueModalOpen(false);
            form.resetFields();
            fetchIssuedBooks();
            fetchDropdownData();
        } catch (err) {
            console.error(err);
            message.error('Failed to issue book');
        }
    };

    const _openEditModal = (loan) => {
        const issuedBookExists = books.some((b) => b.copyId === loan.copyId);
        if (!issuedBookExists && loan.bookTitle) {
            setBooks((prevBooks) => [
                ...prevBooks,
                { copyId: loan.copyId, title: loan.bookTitle, availableCopies: 1 },
            ]);
        }

        setCurrentEditingLoan(loan);
        editForm.setFieldsValue({
            userId: String(loan.userId),
            bookId: String(loan.copyId),
            issueDate: dayjs(loan.dateOfPurchase),
            dueDate: dayjs(loan.expiryDate),
          
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (values) => {
        if (!currentEditingLoan) return;

        setBookError('');
        const selectedBook = books.find((b) => String(b.copyId) === values.bookId);
        if (!selectedBook || selectedBook.availableCopies <= 0) {
            setBookError('Book Copy not available');
            return;
        }

        const payload = {
            LoanId: currentEditingLoan.loanId,
            UserId: values.userId,
            CopyId: values.bookId,
            DateOfPurchase: values.issueDate.format('YYYY-MM-DD'),
            ExpiryDate: values.dueDate.format('YYYY-MM-DD'),
            DateOfReturn: currentEditingLoan.dateOfReturn,
        };

        try {
            await axios.put(
                `https://localhost:7023/api/loan/${currentEditingLoan.loanId}`,
                payload
            );
            message.success('Loan updated successfully');
            setEditModalOpen(false);
            setCurrentEditingLoan(null);
            editForm.resetFields();
            fetchIssuedBooks();
            fetchDropdownData();
        } catch (err) {
            console.error(err);
            message.error('Failed to update loan');
        }
    };

    const handleReturnBook = async (loan) => {
        try {
            await axios.put(`https://localhost:7023/api/loan/return/${loan.loanId}`);
            message.success('Book returned successfully');
            fetchIssuedBooks();
            fetchDropdownData();
        } catch (err) {
            console.error(err);
            message.error('Failed to return book');
        }
    };

    const onSearch = (value) => {
        setSearchText(value);
        const filtered = issuedBooks.filter(
            (book) =>
                book.bookTitle.toLowerCase().includes(value.toLowerCase()) ||
                book.userName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => (a.userName || '').localeCompare(b.userName || ''),
            render: (text) => <Text strong>{text}</Text>,
        },
          {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
              render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Book',
            dataIndex: 'bookTitle',
            key: 'bookTitle',
            sorter: (a, b) => (a.bookTitle || '').localeCompare(b.bookTitle || ''),
            render: (text) => <Text>{text}</Text>,
        },
        {
            title: 'Issue Date',
            dataIndex: 'dateOfPurchase',
            key: 'dateOfPurchase',
            sorter: (a, b) =>
                new Date(a.dateOfPurchase || 0) - new Date(b.dateOfPurchase || 0),
            render: (text) => (text ? dayjs(text).format('YYYY-MM-DD') : ''),
        },
        {
            title: 'Due Date',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            sorter: (a, b) =>
                new Date(a.expiryDate || 0) - new Date(b.expiryDate || 0),
            render: (text) => {
                const isOverdue = text ? dayjs(text).isBefore(dayjs(), 'day') : false;
                return (
                    <Tag color={isOverdue ? 'red' : 'green'}>
                        {text} {isOverdue && '(Overdue)'}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'loanStatus',
            key: 'loanStatus',
            sorter: (a, b) => (a.loanStatus || '').localeCompare(b.loanStatus || ''),
            render: (text) => (
                <Tag color={text === 'Active' ? 'blue' : 'green'}>{text}</Tag>
            ),
        },
    ];

    const renderBookOptions = () => {
        if (books.length === 0) {
            return <Option value="" disabled>No books available</Option>;
        }
        return books.map((b) => (
            <Option key={b.copyId} value={String(b.copyId)}>
                {b.title} ({b.availableCopies} left)
            </Option>
        ));
    };

    return (
        <div
            style={{
                maxWidth: 1000,
                margin: '40px auto',
                background: '#fff',
                padding: 30,
                borderRadius: 12,
                boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            }}
        >
            <Title
                level={2}
                style={{ textAlign: 'center', color: '#1b4332', marginBottom: 30 }}
            >
                Book Issuing & Renewal Management
            </Title>

            <Space
                style={{
                    marginBottom: 20,
                    justifyContent: 'space-between',
                    width: '100%',
                }}
                direction="horizontal"
                size="middle"
            >
                <Button
                    style={{
                        backgroundColor: '#1b4332',
                        borderColor: '#1b4332',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: 16,
                        padding: '8px 24px',
                        borderRadius: 6,
                    }}
                    onClick={() => setIssueModalOpen(true)}
                    size="large"
                >
                    Issue Book
                </Button>

                <Space>
                    <Select
                        placeholder="Search by book title or user name"
                        allowClear
                        showSearch
                        style={{ width: 300 }}
                        onSearch={onSearch}
                    />
                    {/* ✅ Combo box for status */}
                    <Select
                        value={statusFilter}
                        style={{ width: 150 }}
                        onChange={(value) => setStatusFilter(value)}
                    >
                        <Option value="All">All</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Returned">Returned</Option>
                    </Select>
                </Space>
            </Space>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" tip="Loading issued books..." />
                </div>
            ) : (
                <Table
                    dataSource={(searchText ? filteredBooks : issuedBooks).filter((book) => {
                        if (statusFilter === 'All') return true;
                        return book.loanStatus === statusFilter;
                    })}
                    columns={columns}
                    rowKey="loanId"
                    pagination={{ pageSize: 7, showSizeChanger: true }}
                    bordered
                    scroll={{ x: '100%' }}
                />
            )}

            {/* Issue Modal */}
            <Modal
                title="Issue Book"
                open={issueModalOpen}
                onCancel={() => {
                    setIssueModalOpen(false);
                    setBookError('');
                }}
                onOk={() => form.submit()}
                okText="Issue"
                /////////////////////////Issue button
                centered
                destroyOnClose
            >

           {/* ////////////////////////////////////this is text*/}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleIssueSubmit}
                    preserve={false}
                >
                    <Form.Item
                        label="User"
                        name="userId"
                        rules={[{ required: true, message: 'Select a user' }]}
                    >
                        <Select
                            placeholder="Select a user"
                            showSearch
                            optionFilterProp="children"
                        >
                            {users.map((u) => (
                                <Option key={u.userId} value={String(u.userId)}>
                                    {u.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Book"
                        name="bookId"
                        rules={[{ required: true, message: 'Select a book' }]}
                    >
                        <Select
                            placeholder={books.length === 0 ? 'No books available' : 'Select a book'}
                            showSearch
                            optionFilterProp="children"
                            disabled={books.length === 0}
                        >
                            {renderBookOptions()}
                        </Select>
                    </Form.Item>

                    {bookError && (
                        <Text type="danger" style={{ marginBottom: 8, display: 'block' }}>
                            {bookError}
                        </Text>
                    )}

                    <Form.Item
                        label="Issue Date"
                        name="issueDate"
                        rules={[{ required: true, message: 'Select issue date' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Due Date"
                        name="dueDate"
                        rules={[{ required: true, message: 'Select due date' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit Loan"
                open={editModalOpen}
                onCancel={() => {
                    setEditModalOpen(false);
                    setCurrentEditingLoan(null);
                    setBookError('');
                }}
                onOk={() => editForm.submit()}
                okText="Update"
                centered
                destroyOnClose
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                    preserve={false}
                >
                    <Form.Item
                        label="User"
                        name="userId"
                        rules={[{ required: true, message: 'Select a user' }]}
                    >
                        <Select
                            placeholder="Select a user"
                            showSearch
                            optionFilterProp="children"
                        >
                            {users.map((u) => (
                                <Option key={u.userId} value={String(u.userId)}>
                                    {u.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Book"
                        name="bookId"
                        rules={[{ required: true, message: 'Select a book' }]}
                    >
                        <Select
                            placeholder={books.length === 0 ? 'No books available' : 'Select a book'}
                            showSearch
                            optionFilterProp="children"
                            disabled={books.length === 0}
                        >
                            {renderBookOptions()}
                        </Select>
                    </Form.Item>

                    {bookError && (
                        <Text type="danger" style={{ marginBottom: 8, display: 'block' }}>
                            {bookError}
                        </Text>
                    )}

                    <Form.Item
                        label="Issue Date"
                        name="issueDate"
                        rules={[{ required: true, message: 'Select issue date' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Due Date"
                        name="dueDate"
                        rules={[{ required: true, message: 'Select due date' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>

                    {/* ✅ Show status in edit modal */}
                    <Form.Item label="Status" name="status">
                        <Select disabled>
                            <Option value="Active">Active</Option>
                            <Option value="Returned">Returned</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

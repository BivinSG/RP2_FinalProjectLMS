import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    message,
    Popconfirm
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

export default function UserForm() {
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [suspendModalVisible, setSuspendModalVisible] = useState(false);
    const [userToSuspend, setUserToSuspend] = useState(null);

    const baseURL = "https://localhost:7023/api/user"; // Adjust to your actual endpoint

    useEffect(() => {
        axios.get(baseURL)
            .then(res => {
                // Filter out users with role = "admin"
                const filteredUsers = res.data.filter(user => user.role !== "admin");
                setUsers(filteredUsers);
            })
            .catch(() => message.error("Failed to fetch users"));
    }, []);

    const showModal = () => {
        setEditingRow(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRow(record);
        form.setFieldsValue({
            name: record.name,
            dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : null,
            address: record.address,
            mobileNumber: record.mobileNumber,
            emailId: record.emailId
        });
        setModalVisible(true);
    };

    const showSuspendModal = (record) => {
        setUserToSuspend(record);
        setSuspendModalVisible(true);
    };

    const handleSuspend = () => {
        if (!userToSuspend) return;

        // You can modify this API call based on your backend implementation
        // This could be a PATCH request to update status or a DELETE request
        axios.delete(`${baseURL}/${userToSuspend.userId}`)
            .then(() => {
                setUsers(prev => prev.filter(u => u.userId !== userToSuspend.userId));
                message.success("User suspended successfully");
                setSuspendModalVisible(false);
                setUserToSuspend(null);
            })
            .catch(() => {
                message.error("Failed to suspend user");
                setSuspendModalVisible(false);
                setUserToSuspend(null);
            });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null
            };

            if (editingRow) {
                const updatedUser = { userId: editingRow.userId, ...payload };
                await axios.put(`${baseURL}/${editingRow.userId}`, updatedUser);
                setUsers(prev =>
                    prev.map(u => (u.userId === editingRow.userId ? { ...u, ...payload } : u))
                );
                message.success("User updated successfully");
            } else {
                const response = await axios.post(baseURL, payload);
                const newUser = response.data || { ...payload, userId: Math.max(0, ...users.map(u => u.userId || 0)) + 1 };
                setUsers(prev => [...prev, newUser]);
                message.success("User added successfully");
            }

            setModalVisible(false);
            form.resetFields();
            setEditingRow(null);
        } catch (err) {
            console.error("Validation or API Error:", err);
            message.error("Failed to save user");
        }
    };

    const columns = [
        { title: 'User ID', dataIndex: 'userId', key: 'userId' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Date of Birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
        { title: 'Email', dataIndex: 'emailId', key: 'emailId' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => showSuspendModal(record)}
                    >
                        Suspend
                    </Button>
                </>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>User List</h2>
                <Button
                    style={{
                        backgroundColor: '#1b4332',
                        borderColor: '#1b4332',
                        color: '#ffffff',
                        fontWeight: '500',
                    }}
                    onClick={showModal}
                >
                    Add User
                </Button>
            </div>

            <Table
                dataSource={users}
                columns={columns}
                rowKey="userId"
                pagination={false}
            />

            <Modal
                title={editingRow ? 'Edit User' : 'Add User'}
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                    setEditingRow(null);
                }}
                okText={editingRow ? 'Update' : 'Add'}
            >
                <Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input
                            maxLength={50}
                            onKeyPress={(e) => {
                                // Allow only alphabets and spaces
                                if (!/[a-zA-Z\s]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Date of Birth"
                        name="dateOfBirth"
                        rules={[{ required: true, message: 'Please select date of birth' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        label="Mobile Number"
                        name="mobileNumber"
                        rules={[
                            { required: true, message: 'Please enter mobile number' },
                            { len: 10, message: 'Mobile number must be exactly 10 digits' }
                        ]}
                    >
                        <Input
                            maxLength={10}
                            onKeyPress={(e) => {
                                // Allow only numbers
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="emailId"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Suspend User"
                open={suspendModalVisible}
                onOk={handleSuspend}
                onCancel={() => {
                    setSuspendModalVisible(false);
                    setUserToSuspend(null);
                }}
                okText="Yes, Suspend"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to suspend user <strong>{userToSuspend?.name}</strong>?</p>
                <p>This action will remove the user from the active user list.</p>
            </Modal>
        </div>
    );
}
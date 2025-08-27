import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  TagsOutlined,
  UserOutlined,
  BookOutlined,
  SolutionOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Modal, Avatar, Typography } from 'antd';
import '../App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();

  const routeKeyMap = {
    '/admin/add-language': '3',
    '/admin/add-category': '2',
    '/admin/add-author': '1',
    '/admin/add-book': '4',
    '/admin/add-user': '6',
    '/admin/manage-issue': '5',
    '/admin/manage-return': '8',
  };

  const selectedKey = routeKeyMap[location.pathname];

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleLogoutCancel = () => setLogoutModalVisible(false);

  const darkGreen = '#1b4332';
  const lightGreen = '#d8f3dc';
  const textColor = '#081c15';

  return (
    <Layout style={{ minHeight: '100vh', background: lightGreen }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          background: darkGreen,
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          zIndex: 1000,
        }}
      >
        {/* Branding */}
        <div
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'start',
            paddingLeft: collapsed ? 0 : 20,
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          <Avatar
            style={{ backgroundColor: '#52c41a', marginRight: collapsed ? 0 : 10 }}
            size={collapsed ? 40 : 50}
          >
            📚
          </Avatar>
          {!collapsed && <Text style={{ color: '#fff', fontWeight: 'bold' }}>Library Admin</Text>}
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ backgroundColor: darkGreen, borderRight: 0 }}
          items={[
            { key: '1', icon: <GlobalOutlined />, label: <Link to="/admin/add-author">Author</Link> },
            { key: '2', icon: <TagsOutlined />, label: <Link to="/admin/add-category">Category</Link> },
            { key: '3', icon: <UserOutlined />, label: <Link to="/admin/add-language">Language</Link> },
            { key: '4', icon: <BookOutlined />, label: <Link to="/admin/add-book">Book</Link> },
            { key: '6', icon: <UserAddOutlined />, label: <Link to="/admin/add-user">Add User</Link> },
            { key: '5', icon: <SolutionOutlined />, label: <Link to="/admin/manage-issue">Manage Issue</Link> },
            { key: '8', icon: <SolutionOutlined />, label: <Link to="/admin/manage-return">Manage Return</Link> },
            { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.3s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: darkGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fc0d0dff',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 20, color: '#fff' }}
          />
          <Title level={4} style={{ color: '#fff', margin: 0 }}>
            {location.pathname.split('/')[2]?.replace('-', ' ').toUpperCase() || 'Dashboard'}
          </Title>
          <Avatar style={{ backgroundColor: '#87d068' }} size={40}>
            AD
          </Avatar>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 500,
            background: '#ffffff',
            color: textColor,
            borderRadius: borderRadiusLG,
            boxShadow: '0 8px 24px rgba(188, 128, 128, 0.1)',
            transition: 'all 0.3s',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Logout Modal */}
      <Modal
        title="Confirm Logout"
        open={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        okText="Logout"
        cancelText="Cancel"
        okType="danger"
      >
        Are you sure you want to logout?
      </Modal>
    </Layout>
  );
};

export default AdminLayout;
        
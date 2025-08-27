import { useState } from "react";
import { Layout, Menu, Modal, Typography, Avatar } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import Profile from "./Profile.jsx";
import Fines from "./Fines.jsx";
import Loans from "./Loans.jsx";
import Review from "./Review.jsx";
import Books from "./Books.jsx";
import Reservations from "./Reservations.jsx"; // <-- import your Reservations component

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const [activeItem, setActiveItem] = useState("books");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const menuItems = [
    { key: "books", icon: <BookOutlined />, label: "Books" },
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "loans", icon: <ShoppingCartOutlined />, label: "Loans" },
    { key: "fine", icon: <DollarOutlined />, label: "Fines" },
    { key: "review", icon: <StarOutlined />, label: "Reviews" },
    { key: "reservations", icon: <CalendarOutlined />, label: "Reservations" }, // <-- new item
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      setLogoutModalVisible(true);
    } else {
      setActiveItem(key);
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleLogoutCancel = () => setLogoutModalVisible(false);

  const renderContent = () => {
    switch (activeItem) {
      case "books":
        return <Books />;
      case "profile":
        return <Profile />;
      case "loans":
        return <Loans />;
      case "fine":
        return <Fines />;
      case "review":
        return <Review />;
      case "reservations":
        return <Reservations />; // <-- render Reservations
      default:
        return <Books />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Sidebar */}
      <Sider
        width={220}
        style={{
          background: "#2c3e50",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ padding: 20, textAlign: "center", color: "white" }}>
          <Avatar size={64} style={{ backgroundColor: "#e67e22", marginBottom: 10 }}>
            U
          </Avatar>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            My Library
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.7)" }}>Welcome back!</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeItem]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            background: "#2c3e50",
            fontWeight: 500,
          }}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#ecf0f1",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "#2c3e50" }}>
            {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
          </Title>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minHeight: "80vh",
              padding: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            }}
          >
            {renderContent()}
          </div>
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

export default Home;

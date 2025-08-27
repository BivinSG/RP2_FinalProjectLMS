import { useState, useEffect } from "react";
import { GetIdFromLocalStorage } from "../../utils/helper";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Divider,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const Profile = () => {
  const [userId] = useState(() => GetIdFromLocalStorage());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7023/api/user/${userId}`);
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "";

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spin size="large" /></div>;
  if (error) return <div style={{ padding: 24, maxWidth: 600 }}><Alert message={error} type="error" showIcon /></div>;

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center", background: "#f0f2f5", minHeight: "50vh" }}>
      <Card
        style={{
          maxWidth: 650,
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Avatar and Name */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Avatar size={70} style={{ backgroundColor: "#1890ff" }}>
            {getInitials(data?.name) || <UserOutlined />}
          </Avatar>
          <Title level={3} style={{ margin: "8px 0" }}>{data?.name || "User Name"}</Title>
          <Text type="secondary">{data?.role || "User Role"}</Text>
        </div>

        <Divider />

        {/* User Info Compact */}
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><UserOutlined /> ID</Text>
              <br />
              <Text strong>#{data?.userId}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><CalendarOutlined /> DOB</Text>
              <br />
              <Text>{data?.dateOfBirth || "N/A"}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><PhoneOutlined /> Mobile</Text>
              <br />
              <Text>{data?.mobileNumber || "N/A"}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><MailOutlined /> Email</Text>
              <br />
              <Text>{data?.emailId || "N/A"}</Text>
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><HomeOutlined /> Address</Text>
              <br />
              <Text>{data?.address || "N/A"}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary"><SafetyCertificateOutlined /> Role</Text>
              <br />
              <Tag color="blue">{data?.role || "Not specified"}</Tag>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" bordered={false} hoverable>
              <Text type="secondary">Status</Text>
              <br />
              <Tag color={data?.isActive === "Yes" ? "green" : "red"}>
                {data?.isActive === "Yes" ? "Active" : "Inactive"}
              </Tag>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;

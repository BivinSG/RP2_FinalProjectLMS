import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { UserOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";

const LIBRARY_BG_URL =
  "https://images.pexels.com/photos/3646172/pexels-photo-3646172.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://localhost:7023/api/user");
        if (response.ok) {
          const users = await response.json();
          setUsersData(users);
        } else {
          message.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Error connecting to server");
      }
    };
    fetchUsers();
  }, []);

  // Load saved user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(login(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  // Redirect user if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "Admin") navigate("/admin");
      else if (user.role === "user") navigate("/user/home");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    setLoading(true);

    const foundUser = usersData.find(
      (u) => u.name === username && u.password === password && u.isActive === "Yes"
    );

    setTimeout(() => {
      if (foundUser) {
        const userLoginData = {
          userId: foundUser.userId,
          username: foundUser.name,
          role: foundUser.role,
          emailId: foundUser.emailId,
        };

        dispatch(login(userLoginData));
        localStorage.setItem("user", JSON.stringify(userLoginData));
        message.success(`Welcome ${foundUser.name} (${foundUser.role})`);

        if (foundUser.role === "admin") navigate("/admin");
        else if (foundUser.role === "user") navigate("/user/home");
      } else {
        message.error("Invalid username, password, or account may be inactive");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${LIBRARY_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.35)",
          zIndex: 0,
        }}
      />

      {/* Glassmorphic Card */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2.5rem",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "24px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
          width: "100%",
          maxWidth: "420px",
          minHeight: "520px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.23)",
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <BookOutlined
            style={{
              fontSize: "2.4rem",
              color: "#fff",
              background: "rgba(59,46,18,0.85)",
              borderRadius: "50%",
              padding: "0.5rem",
              marginBottom: "8px",
              boxShadow: "0 4px 16px rgba(44,62,80,0.15)",
            }}
          />
          <h1
            style={{
              color: "#fff",
              fontSize: "2.2rem",
              fontWeight: 700,
              margin: "0.2rem 0",
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Library Login
          </h1>
          <p
            style={{
              color: "#f0e6d2",
              fontSize: "1.1rem",
              lineHeight: "1.5",
              textShadow: "1px 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            Access your account for the digital library experience.
          </p>
        </div>

        {/* Form */}
        <Form layout="vertical" autoComplete="off" onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#3B2E12" }} />}
              placeholder="Username"
              size="large"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                borderRadius: "12px",
                height: "48px",
                fontSize: "1.05rem",
                borderColor: "#cacaca",
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#3B2E12" }} />}
              placeholder="Password"
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "12px",
                height: "48px",
                fontSize: "1.05rem",
                borderColor: "#cacaca",
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              style={{
                width: "100%",
                height: "48px",
                background: "linear-gradient(90deg, #8B5E3C 0%, #C58940 100%)",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.08rem",
                fontWeight: "500",
                boxShadow: "0 4px 16px rgba(197,141,64,0.4)",
                color: "#fff",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Footer text */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#f0e6d2",
            fontSize: "0.95rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Need help? Contact your librarian
        </div>
      </div>
    </div>
  );
};

export default Login;

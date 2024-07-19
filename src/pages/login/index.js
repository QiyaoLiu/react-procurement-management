import React from "react";
import { Form, Input, Button, message } from "antd";
import "./login.css";
import { getPermission } from "../../api";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // If already logged in, navigate to home
  if (localStorage.getItem("token")) {
    return <Navigate to="/home" replace />;
  }

  // Handle form submission
  const handleSubmit = async (values) => {
    const { username, password } = values;

    if (!username || !password) {
      message.warning("Please enter username and password");
      return;
    }

    try {
      const { data, status } = await getPermission(values);

      if (status === 200) {
        if (data.code === 1) {
          localStorage.setItem("token", data.data); // Store the token
          navigate("/home"); // Navigate to home on successful login
        } else {
          message.error(
            data.msg || "Unexpected error occurred. Please try again."
          );
        }
      } else {
        // Handle cases where the response status is not 200 OK
        message.error("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.msg || "Failed to login. Please try again later.";
      message.error(errorMessage);
    }
  };
  return (
    <Form className="login-container" onFinish={handleSubmit}>
      <div className="login_title">System Login</div>
      <Form.Item label="Account Name" name="username">
        <Input placeholder="Please enter account name" />
      </Form.Item>

      <Form.Item label="Password" name="password">
        <Input.Password placeholder="Please enter password" />
      </Form.Item>
      <Form.Item className="login-button">
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
export default Login;

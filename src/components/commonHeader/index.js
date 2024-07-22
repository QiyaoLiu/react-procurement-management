import React, { useCallback } from "react";
import { Button, Layout, Avatar, Dropdown } from "antd";
import "./index.css";
import { MenuFoldOutlined, UserOutlined } from "@ant-design/icons";
import { collapseMenu } from "../../store/reducers/tab";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const CommonHeader = ({ collapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    try {
      // Clear the token
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate]);

  const items = [
    {
      key: "1",
      label: (
        <a onClick={logout} href="#" rel="noopener noreferrer">
          log out
        </a>
      ),
    },
  ];

  const setCollapsed = useCallback(() => {
    dispatch(collapseMenu());
  }, [dispatch]);

  return (
    <Header className="header-container">
      <Button
        type="text"
        icon={<MenuFoldOutlined />}
        style={{
          fontSize: "16px",
          width: 64,
          height: 32,
          backgroundColor: "#fff",
        }}
        onClick={() => {
          setCollapsed();
        }}
      />
      <Dropdown menu={{ items }}>
        <Avatar
          size={36}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#C0C0C0" }}
        />
      </Dropdown>
    </Header>
  );
};

export default CommonHeader;

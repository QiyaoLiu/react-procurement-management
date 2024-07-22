import React from "react";
import * as Icon from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";

const { Sider } = Layout;

const MenuConfig = [
  {
    path: "/home",
    name: "home",
    label: "home",
    icon: "HomeOutlined",
    url: "/home/index",
  },
  {
    path: "/supplier",
    name: "supplier",
    label: "supplier",
    icon: "UserOutlined",
    url: "/supplier/index",
  },
  {
    path: "/order",
    name: "order",
    label: "purchase order",
    icon: "ShopOutlined",
    url: "/order/index",
  },
];

// Function to create an icon element
const iconToElement = (name) => React.createElement(Icon[name]);

// Create menu items from MenuConfig
const items = MenuConfig.map((item) => {
  const child = {
    key: item.path,
    icon: iconToElement(item.icon),
    label: item.label,
  };
  if (item.children) {
    child.children = item.children.map((subItem) => {
      return {
        key: subItem.path,
        label: subItem.label,
      };
    });
  }
  return child;
});

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate();

  console.log(collapsed, "commenAside");

  const selectMenu = (item) => {
    console.log(item);
    navigate(item.key);
  };

  return (
    <Sider trigger={null} collapsed={collapsed} width={250} collapsedWidth={80}>
      <h3 className="app-name">
        {collapsed ? "PM" : "procurement management"}
      </h3>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{ overflow: "auto", height: "100%" }}
        onClick={selectMenu}
      />
    </Sider>
  );
};
export default CommonAside;

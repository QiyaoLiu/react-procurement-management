import React from "react";
import * as Icon from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";

const { Sider } = Layout;

const iconToElement = (name) => React.createElement(Icon[name]);

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
    label: "supplier management",
    icon: "UserOutlined",
    url: "/supplier/index",
  },
  {
    path: "/order",
    name: "order",
    label: "order management",
    icon: "ShopOutlined",
    url: "/order/index",
  },
];

const items = MenuConfig.map((icon) => {
  const child = {
    key: icon.path,
    icon: iconToElement(icon.icon),
    label: icon.label,
  };
  if (icon.childern) {
    child.children = icon.children.map((item) => {
      return {
        key: item.path,
        label: item.label,
      };
    });
  }
  return child;
});

const CommonAside = ({ collapsed }) => {
  const navigate = useNavigate();

  console.log(collapsed, "commenAside");

  const selectMenu = (e) => {
    console.log(e);
    navigate(e.key);
  };

  return (
    <Sider trigger={null} collapsed={collapsed} width={230} collapsedWidth={50}>
      <h3 className="app-name">
        {collapsed ? "procurement" : "procurement management"}
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

import React, { useState, useEffect } from "react";
import * as Icons from "@ant-design/icons";
import { Card, Col } from "antd";
import "./home.css";

import {
  countSupplierMonth,
  countSupplierTotal,
  countOrderMonth,
  countAmountMonth,
} from "../../api";

const iconToElement = (name) => React.createElement(Icons[name]);

const Home = () => {
  const [supplierMonthCount, setSupplierMonthCount] = useState(0);
  const [supplierTotalCount, setSupplierTotalCount] = useState(0);
  const [orderMonthCount, setOrderMonthCount] = useState(0);
  const [amountMonthCount, setAmountMonthCount] = useState(0);

  useEffect(() => {
    countSupplierMonth()
      .then((response) => {
        setSupplierMonthCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching supplier month count:", error);
      });
  }, []);

  useEffect(() => {
    countSupplierTotal()
      .then((response) => {
        setSupplierTotalCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching supplier total count:", error);
      });
  }, []);

  useEffect(() => {
    countOrderMonth()
      .then((response) => {
        setOrderMonthCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order month count:", error);
      });
  }, []);

  useEffect(() => {
    countAmountMonth()
      .then((response) => {
        setAmountMonthCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order month count:", error);
      });
  }, []);

  const countData = [
    {
      name: "New Supplier of this Month",
      value: supplierMonthCount,
      icon: "CheckCircleOutlined",
      color: "#9EC8B9",
    },
    {
      name: "Total Supplier Amount",
      value: supplierTotalCount,
      icon: "CheckCircleOutlined",
      color: "#9EC8B9",
    },
    {
      name: "New Purchase Order of this Month",
      value: orderMonthCount,
      icon: "CheckCircleOutlined",
      color: "#5C8374",
    },
    {
      name: "Total Purchase Amount of this Month",
      value: `${amountMonthCount} €`,
      icon: "CheckCircleOutlined",
      color: "#5C8374",
    },
  ];

  return (
    <Col span={20}>
      <div className="num">
        {countData.map((item, index) => {
          return (
            <Card hoverable key={index}>
              <div className="icon-box" style={{ background: item.color }}>
                {iconToElement(item.icon)}
              </div>
              <div className="detail">
                <p className="num">{item.value}</p>
                <p className="txt">{item.name}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </Col>
  );
};

export default Home;

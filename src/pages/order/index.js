import React, { useEffect, useState } from "react";
import { Button, Form, Input, Table, Popconfirm, Modal, Select } from "antd";
import "./order.css";
import {
  getOrder,
  addOrder,
  updateOrder,
  delOrder,
  getSupplier,
} from "../../api/index.js";

const { Option } = Select;

const Order = () => {
  const [listData, setListData] = useState({
    supplierName: "",
    materialName: "",
    page: 1,
    pageSize: 10,
  });
  const [tableData, setTableData] = useState([]);
  const [modalType, setModalType] = useState(0); // 0 for add, 1 for edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: listData.pageSize,
    current: listData.page,
    total: 0, // Initial total count, should be updated after fetching data
  });

  // Effect Hook to Fetch Data
  useEffect(() => {
    console.log("Fetching data with listData:", listData);
    getTableData();
    fetchSuppliers(); // Fetch suppliers when component mounts
  }, [listData]);

  // Fetches table data from API based on current listData
  const getTableData = () => {
    getOrder(listData)
      .then(({ data }) => {
        setTableData(data.data.rows);
        setPagination({
          ...pagination,
          current: listData.page,
          total: data.data.totalRecords,
        });
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  };

  // Fetches all suppliers
  const fetchSuppliers = () => {
    getSupplier()
      .then((data) => {
        if (Array.isArray(data.data.data.rows)) {
          setSuppliers(data.data.data.rows);
          console.log(data.data.data.rows);
        } else {
          console.error(
            "Invalid response format for suppliers:",
            data.data.data.rows
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  };

  // Handle search form submission
  const handleFinish = (values) => {
    console.log("Search submitted with values:", values);
    setListData({
      supplierName: values.supplierName || "",
      materialName: values.materialName || "",
      page: 1,
      pageSize: 10,
    });
  };

  // Opens modal for adding or editing an order
  const handleClick = (type, rowData) => {
    setIsModalOpen(true);
    setModalType(type === "add" ? 0 : 1);
    if (type === "edit") {
      form.setFieldsValue(rowData);
    }
  };

  // Handles form submission for adding or editing an order
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (modalType === 0 && !values.supplierId) {
          throw new Error("Please select a supplier");
        }

        if (modalType === 1) {
          updateOrder(values).then(() => {
            handleCancel();
            getTableData();
          });
        } else {
          addOrder(values).then(() => {
            handleCancel();
            getTableData();
          });
        }
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  // Closes the modal and resets form fields
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Deletes an order
  const handleDelete = (id) => {
    delOrder(id)
      .then(() => {
        getTableData();
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };

  // Handles pagination change
  const handlePageChange = (page, pageSize) => {
    setListData((prevState) => ({ ...prevState, page, pageSize }));
  };

  // Table Columns Definition
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Material Name", dataIndex: "materialName" },
    { title: "Supplier", dataIndex: "supplierName" },
    { title: "Material Quantity", dataIndex: "materialQuantity" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Single Price (€)", dataIndex: "singlePrice" },
    { title: "Total Price (€)", dataIndex: "totalPrice" },
    { title: "Comment", dataIndex: "comment" },
    {
      title: "Action",
      render: (rowData) => (
        <div className="flex-box">
          <Button
            style={{
              marginRight: "5px",
              backgroundColor: "#5C8374",
              color: "#fff",
            }}
            onClick={() => handleClick("edit", rowData)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Do you really want to delete this order?"
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => handleDelete(rowData.id)}
            okButtonProps={{
              style: { backgroundColor: "#FF4C4C", borderColor: "##FF4C4C" },
            }}
          >
            <Button
              type="primary"
              danger
              style={{ backgroundColor: "#FF4C4C" }}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Rendering UI
  return (
    <div className="order">
      <div className="flex-box space-between">
        <Form layout="inline" onFinish={handleFinish}>
          <Form.Item name="materialName">
            <Input placeholder="Material Name" />
          </Form.Item>
          <Form.Item name="supplierName">
            <Input placeholder="Supplier Name" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              style={{ backgroundColor: "#5C8374" }}
            >
              Search
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="primary"
          style={{ backgroundColor: "#5C8374" }}
          onClick={() => handleClick("add")}
        >
          + Add New Purchase Order
        </Button>
      </div>
      <Table
        style={{ marginTop: "20px" }}
        columns={columns}
        dataSource={tableData}
        rowKey={"id"}
        pagination={{
          pageSize: listData.pageSize,
          current: listData.page,
          total: pagination.total,
          onChange: handlePageChange,
        }}
      />
      <Modal
        open={isModalOpen}
        title={modalType ? "Edit Order" : "Add Order"}
        onOk={handleOk}
        okButtonProps={{
          style: { backgroundColor: "#5C8374", borderColor: "#5C8374" },
        }}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          {modalType === 1 && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="Supplier"
            name="supplierId"
            rules={[{ required: true, message: "Please select a supplier" }]}
          >
            <div>
              <Select
                placeholder="Please select a supplier"
                onChange={(value) => form.setFieldsValue({ supplierId: value })}
              >
                {suppliers.map((supplier) => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </Option>
                ))}
              </Select>
              <p style={{ marginTop: "5px", color: "gray", fontSize: "12px" }}>
                If your desired supplier is not listed, please manage suppliers
              </p>
            </div>
          </Form.Item>
          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true, message: "Please enter material name" }]}
          >
            <Input placeholder="Please enter material name" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="materialQuantity"
            rules={[
              { required: true, message: "Please enter material quantity" },
            ]}
          >
            <Input placeholder="Please enter material quantity" />
          </Form.Item>
          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: "Please enter unit" }]}
          >
            <Input placeholder="Please enter unit" />
          </Form.Item>
          <Form.Item
            label="Single Price (€)"
            name="singlePrice"
            rules={[{ required: true, message: "Please enter single price" }]}
          >
            <Input placeholder="Please enter single price" />
          </Form.Item>
          <Form.Item
            label="Total Price (€)"
            name="totalPrice"
            rules={[{ required: true, message: "Please enter total price" }]}
          >
            <Input placeholder="Please enter total price" />
          </Form.Item>
          <Form.Item
            label="Comment"
            name="comment"
            rules={[
              {
                required: false,
                message: "Enter comment if needed",
              },
            ]}
          >
            <Input placeholder="Enter comment if needed"></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;

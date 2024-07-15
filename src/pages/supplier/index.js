import React, { useEffect, useState } from "react";
import { Button, Form, Input, Table, Popconfirm, Modal } from "antd";
import "./supplier.css";
import {
  getSupplier,
  addSupplier,
  updateSupplier,
  delSupplier,
} from "../../api/index.js";

const Supplier = () => {
  const [listData, setListData] = useState({
    supplierName: "",
    page: 1,
    pageSize: 10,
  });
  const [tableData, setTableData] = useState([]);
  const [modalType, setModalType] = useState(0); // 0 for add, 1 for edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    pageSize: listData.pageSize,
    current: listData.page,
    total: 0, // Initial total count, should be updated after fetching data
  });

  useEffect(() => {
    console.log("Fetching data with listData:", listData);
    getTableData();
  }, [listData]);

  const getTableData = () => {
    getSupplier(listData)
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

  const handleFinish = (values) => {
    console.log("Search submitted with values:", values);
    setListData({
      supplierName: values.keyword || "",
      page: 1,
      pageSize: 10,
    });
  };

  const handleClick = (type, rowData) => {
    setIsModalOpen(true);
    setModalType(type === "add" ? 0 : 1);
    if (type === "edit") {
      form.setFieldsValue(rowData);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (modalType === 1) {
          updateSupplier(values).then(() => {
            handleCancel();
            getTableData();
          });
        } else {
          addSupplier(values).then(() => {
            handleCancel();
            getTableData();
          });
        }
      })
      .catch((errorInfo) => {
        console.error("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    delSupplier(id)
      .then(() => {
        getTableData();
      })
      .catch((error) => {
        console.error("Error deleting supplier:", error);
      });
  };

  const handlePageChange = (page, pageSize) => {
    setListData((prevState) => ({ ...prevState, page, pageSize }));
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Supplier", dataIndex: "supplierName" },
    { title: "Address", dataIndex: "address" },
    { title: "Contact Person", dataIndex: "contactPerson" },
    { title: "E-Mail", dataIndex: "email" },
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
            title="Do you really want to delete this supplier?"
            okText="Confirm"
            okButtonProps={{
              style: { backgroundColor: "#FF4C4C", borderColor: "##FF4C4C" },
            }}
            cancelText="Cancel"
            onConfirm={() => handleDelete(rowData.id)}
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

  return (
    <div className="supplier">
      <div className="flex-box space-between">
        <Form layout="inline" onFinish={handleFinish}>
          <Form.Item name="keyword">
            <Input placeholder="Supplier name" />
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
          + Add New Supplier
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
        title={modalType ? "Edit Supplier" : "Add Supplier"}
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
            name="supplierName"
            rules={[{ required: true, message: "Please enter supplier name" }]}
          >
            <Input placeholder="Please enter supplier name" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, message: "Please enter supplier address" },
            ]}
          >
            <Input placeholder="Please enter supplier address" />
          </Form.Item>
          <Form.Item
            label="Contact Person"
            name="contactPerson"
            rules={[
              {
                required: true,
                message: "Please enter supplier contact person",
              },
            ]}
          >
            <Input placeholder="Please enter supplier contact person" />
          </Form.Item>
          <Form.Item
            label="E-Mail"
            name="email"
            rules={[
              { required: true, message: "Please enter supplier E-Mail" },
            ]}
          >
            <Input placeholder="Please enter supplier E-Mail" />
          </Form.Item>
          <Form.Item
            label="Comment"
            name="comment"
            rules={[{ required: false, message: "Enter comment if needed" }]}
          >
            <Input placeholder="Enter comment if needed" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplier;

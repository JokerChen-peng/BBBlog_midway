import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import {userRegister} from "../utils/request"

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = () => {
  userRegister(username,password)
      .then((resp) => {
        if (resp) {
          alert(`注册成功，快去登入吧`);
        } else {
          alert(`注册失败`);
        }
      });
  };
  return (
    <Form
      name="basic"
      layout="inline"
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item
        label="用户名"
        name="用户名"
        rules={[
          {
            required: true,
            message: "请输入你的用户名!",
          },
        ]}
      >
        <Input
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </Form.Item>

      <Form.Item
        label="密码"
        name="密码"
        rules={[
          {
            required: true,
            message: "请输入你的密码!",
          },
        ]}
      >
        <Input.Password
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" onClick={handleRegister}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;

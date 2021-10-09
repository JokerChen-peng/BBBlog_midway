import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { userLogin} from "../utils/request"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    userLogin(username,password)
      .then((resp) => {
        if (resp.success) {
          localStorage.setItem("author", resp.data.author);
          alert(`登录成功`);
        } else {
          alert(`登录失败`);
        }
      });
  };

  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
      layout="inline"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: "请输入你的用户名",
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
        name="password"
        rules={[
          {
            required: true,
            message: "请输入你的密码",
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
        <Button type="primary" htmlType="submit" onClick={handleLogin}>
          登入
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;

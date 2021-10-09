import React, { useState, useEffect } from "react";
import { Layout, Menu, Input, Button, Row, Col, Card } from "antd";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "axios";
import { InfiniteListExample } from "./CardList";
import Tea from "./Tea";
import Advise from "./Advise";
import Login from "./Login";
import Detail from "./Detail";
import Update from "./Update";
import Register from "./Register";
import New from "./new";
import {
  HomeOutlined,
  FileTextOutlined,
  CoffeeOutlined,
  AudioOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "#1890ff",
    }}
  />
);

const { Header, Sider, Content, Footer } = Layout;

export default function SiderDemo() {
  const [collapsed, SetCollapsed] = useState(false);

  const toggle = () => {
    SetCollapsed(!collapsed);
  };

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Sider
            className="sider"
            collapsible
            trigger={null}
            breakpoint="lg"
            onBreakpoint={toggle}
          >
            <Menu className="menu" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1" icon={<HomeOutlined />}>
                <Link to="/">首页</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<FileTextOutlined />}>
                <Link to="/advise">排行榜</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<CoffeeOutlined />}>
                <Link to="/tea"> 须知 </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <Row style={{ background: "white" }}>
                <Col span={6}></Col>
                <Col>
                  <Search
                    placeholder="目前还不支持搜索功能"
                    style={{
                      width: 200,
                    }}
                  />
                </Col>
                <Col span={6}></Col>
                <Col>
                  <Button type="primary" style={{}}>
                    <Link to="/login">登入</Link>
                  </Button>
                  <Button>
                    <Link to="/register">注册</Link>
                  </Button>
                </Col>
              </Row>
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 800,
              }}
            >
              <Route
                path="/"
                exact
                render={() => <InfiniteListExample />}
              ></Route>

              <Route path="/advise" exact render={() => <Advise />}></Route>
              <Route path="/tea" exact render={() => <Tea />}></Route>
              <Route path="/login" exact render={() => <Login />}></Route>
              <Route path="/register" exact render={() => <Register />}></Route>
              <Route path="/detail" exact render={() => <Detail />}></Route>
              <Route path="/update" exact render={() => <Update />}></Route>
              <Route path="/new" exact render={() => <New />}></Route>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              BBBlog ©2020 Created by kunpeng
            </Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    </>
  );
}

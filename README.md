# 开启阿里云severless云开发之旅--实现一个简单的博客

## 写在之前

今年8.03-8.10，我有幸参加了阿里云的云开发校园合伙人创造营，成为了云开发校园合伙人。

这篇文章是对之前学习的总结和我自己对阿里云severless云开发的一些经验。

水平有限，多多包涵！！

## 开发前的准备工作

首先你得有一个阿里云账号

之后在谷歌浏览器中输入https://workbench.aliyun.com/ 点击免费云开发，创建一个新应用。

![Snipaste_2020-11-04_18-25-47.png](https://i.loli.net/2020/11/07/gft68M9hrXwUYqm.png)


![Snipaste_2020-11-04_18-27-40.png](https://i.loli.net/2020/11/07/xmIjvhWYb3K1yR7.png)

有很多应用场景，根据自己的需求选择即可。我们这里选择实验室，选择midway serverless ots数据库示例。（因为ots数据库基本免费）

![Snipaste_2020-11-04_18-32-00.png](https://i.loli.net/2020/11/07/QgiqOjF5bX2kfa9.png)

在过程中可能需要购买一些服务，购买即可，都是免费。

输入应用名称和应用介绍，点击完成。

![Snipaste_2020-11-04_18-44-27.png](https://i.loli.net/2020/11/07/tIWedsocQpfHnGg.png)

稍等一会，项目就创建成啦。

![Snipaste_2020-11-04_18-52-40.png](https://i.loli.net/2020/11/07/iMTemfnNF9kSOgv.png)

创建完成以后点击应用配置，在浏览器输入https://www.aliyun.com/product/ots，点击管理控制台，点击创建实例，输入名称，点击确定。

点击创建好的实例，把实例名称和公网分别复制到**应用配置**中的实例名和endPoint上，点击自己的头像，查看自己的accesskey与secret，并复制自己的accesskey与secret。

![Snipaste_2020-11-04_19-48-06.png](https://i.loli.net/2020/11/07/oLhCQRjYi9Gxrn7.png)

![Snipaste_2020-11-04_19-51-06.png](https://i.loli.net/2020/11/07/q6xlUYtBLAdTHmP.png)

![Snipaste_2020-11-04_20-56-22.png](https://i.loli.net/2020/11/07/mtBSR6E37jcIZhl.png)

![Snipaste_2020-11-04_20-51-03.png](https://i.loli.net/2020/11/07/k5vedjat7qF4PND.png)

![Snipaste_2020-11-04_19-09-40.png](https://i.loli.net/2020/11/07/lJhHj6YvritMB57.png)



点击创建数据表，创建两个表blog和user。设置blog的主键为id，user的主键为username和password。

之后点击创建数据表，创建完成后返回项目页面

![Snipaste_2020-11-04_19-55-05.png](https://i.loli.net/2020/11/07/N6LI2vi59We1dUD.png)

![Snipaste_2020-11-04_20-59-47.png](https://i.loli.net/2020/11/07/dmaSDtxzYZ31IcN.png)











点击开发部署

ok，熟悉的味道

![Snipaste_2020-11-04_18-59-49.png](https://i.loli.net/2020/11/07/AUqmCSW8Br6NJT9.png)

安装依赖







```
npm i
```



试这运行一下







```
npm run dev
```

来看一下demo的页面

至此准备工作就完成啦

## Fass能做什么

当前的函数，可以当做一个小容器，原来我们要写一个完整的应用来承载能力，现在只需要写中间的逻辑部分，以及考虑输入和输出的数据。

随着时间的更替，平台的迭代，函数的能力会越来越强，而用户的上手成本，服务器成本则会越来越低。

## Midway Serverless

Midway Serverless 是用于构建 Node.js 云函数的 Serverless 框架。帮助你在云原生时代大幅降低维护成本，更专注于产品研发。

基本使用方式就是在f.yml里面配置路由，通过装饰器实现函数的依赖注入

官网介绍https://www.yuque.com/midwayjs/faas/

## 编写后端接口

### 编写注册函数

首先在f.yml里functions中配置register函数，**注意格式**







```yml
functions:
  register:
    handler: user.register
    events:
      - apigw:
          path: /api/user/register  
```

之后在src/apis/index.ts里，把默认的几个函数删除

新增一个register函数



```JavaScript
  @Func('user.register')
  async  register() {
    const { username, password } = this.ctx.request.body;
    const params = {
      tableName: "user",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { username }, { password }
      ]
    };
    return new Promise(resolve => {
      this.tb.putRow(params, async function (err, data) {
        if (err) {

          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });
  }
```



### 编写登入函数

配置f.yml







```yml
  login:
    handler: user.login
    events:
      - apigw:
          path: /api/user/login
```



编写login函数





```JavaScript
 @Func('user.login')
  async  login() {
    const { username, password } = this.ctx.request.body;
    const params = {
      tableName: 'user',
      primaryKey: [{ username }, { password }],
      direction: TableStore.Direction.BACKWARD
    };
    return new Promise(resolve => {
      this.tb.getRow(params, async (_, data) => {

        await format.row(data.row)
        const row = format.row(data.row)
        if (row) {

          resolve({
            author: row.username,
            success: true
          });
        } else {
          resolve({ success: false });
        }
      });
    })
  }
```



### 编写获取博客列表函数

配置f.yml







```yml
  list:
    handler: blog.list
    events:
      - apigw:
          path: /api/blog/list
```



编写list函数







```javascript
 @Func('blog.list')
  async handler() {
    const params = {
      tableName: 'blog',
      direction: TableStore.Direction.BACKWARD,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MAX }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MIN }]
    };
    return new Promise(resolve => {
      this.tb.getRange(params, (_, data) => {
        const rows = format.rows(data, { email: true });
        resolve(rows);
      });
    })
  }
```



### 编写博客详情页函数

配置f.yml 文件







```yml
  detail:
    handler: blog.detail
    events:
      - apigw:
          path: /api/blog/detail
```



编写detail函数







```JavaScript
  @Func('blog.detail')
  async  detail() {

    const { id } = this.ctx.query;
    const params = {
      tableName: 'blog',
      primaryKey: [{ 'id': id }],
      direction: TableStore.Direction.BACKWARD,
      inclusiveStartPrimaryKey: [{ id: TableStore.INF_MAX }],
      exclusiveEndPrimaryKey: [{ id: TableStore.INF_MIN }]
    };
    return new Promise(resolve => {
      this.tb.getRow(params, (_, data) => {
        const row = format.row(data.row);
        resolve(row);
      });
    })
  }
```







### 编写删除当前博客函数

配置f.yml







```yml
  del:
    handler: blog.del
    events:
      - apigw:
          path: /api/blog/del
```



编写remove函数







```JavaScript
 @Func('blog.del')
  async remove() {
    const { id } = this.ctx.query;
    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ id }]
    };
    return new Promise(resolve => {
      this.tb.deleteRow(params, function (err, data) {
        if (err) {
          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });
  }
```



### 编写新建博客的函数

配置f.yml 文件







```yml
  new:
    handler: blog.new
    events:
      - apigw:
          path: /api/blog/new
```



编写 add 函数







```JavaScript
  @Func('blog.new')
  async add() {
    const { content, title, author } = this.ctx.query;

    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { id: `${Date.now()}-${Math.random()}` }
      ],
      attributeColumns: [
        { content },
        { title },
        { author }
      ]
    };
    return new Promise(resolve => {
      this.tb.putRow(params, async function (err, data) {
        if (err) {
          resolve({
            success: false,
            errmsg: err.message
          });
        } else {
          resolve({
            success: true
          });
        }
      });
    });
  }
```



### 编写更新博客的函数

配置f.yml 文件









```yml
  update:
    handler: blog.update
    events:
      - apigw:
          path: /api/blog/update
```



编写update函数







```javascript
  @Func('blog.update')
  async update() {
    const { id, content, title, author } = this.ctx.query;
    const params = {
      tableName: "blog",
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [
        { 'id': id },
      ],
      attributeColumns: [
        { content },
        { title },
        { author }
      ]
    };
    return new Promise((resolve) => {
      this.tb.putRow(params, function (err, data) {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
```



## 使用react编写前端页面

使用ant degsin 作为ui组件 官方文档看这里 https://ant.design/components/overview-cn/

使用 echarts 作为统计用户博客数量的插件 官方文档看这里 https://echarts.apache.org/zh/tutorial.html

使用 axios 调用后端接口 官方文档看这里 http://www.axios-js.com/docs/

使用react-router编写前端路由 官方文档看这里 http://react-guide.github.io/react-router-cn/

这是所需要的package.json文件

```json
{
  "name": "midway-faas-ots-demo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@midwayjs/faas": "^0.3.0",
    "@midwayjs/faas-middleware-static-file": "^0.0.4",
    "echarts": "^4.9.0",
    "echarts-for-react": "^2.0.16",
    "koa-session": "^6.0.0",
    "otswhere": "^0.0.4",
    "tablestore": "^5.0.7",
    "todomvc-app-css": "^2.3.0"
  },
  "midway-integration": {
    "tsCodeRoot": "src/apis",
    "lifecycle": {
      "before:package:cleanup": "npm run build"
    }
  },
  "scripts": {
    "dev": "WORKBENCH_ENV=development npm run local:url & npm run watch",
    "watch": "react-scripts start",
    "local:url": "node scripts/local.js",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@midwayjs/faas-cli": "*",
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "@types/jest": "^24.0.0",
    "@types/node": "^12.0.0",
    "@types/react": "^16.9.0",
    "@types/react-dom": "^16.9.0",
    "midway-faas-workbench-dev": "^1.0.1",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "3.4.1",
    "typescript": "~3.7.2",
    "antd": "^4.5.4",
    "axios": "^0.19.2",
    "moment": "^2.27.0",
    "react-infinite-scroller": "^1.2.4",
    "react-router-dom": "^5.2.0"
  }
}

```

覆盖原来的package.json文件后

在命令行输入 npm i 安装依赖

```
npm i 
```

在src中新建文件index.css



```css
@import '~antd/dist/antd.css';
html,body {  
    background-color: #f1f8fd;
    height: 100%;
}
```



### 编写主菜单组件

先把原来src/components里面的文件清空，

在src/components新建menu.tsx文件





```tsx
import React, { useState,useEffect } from 'react'
import { Layout, Menu, Input, Button, Row, Col, Card } from 'antd';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import axios from 'axios'
import {InfiniteListExample} from './CardList'
import Tea from './Tea'
import Advise from './Advise'
import Login from './Login'
import Detail from './Detail'
import Update from './Update';
import Register from './Register';
import New from './new'
import {
  HomeOutlined,
  FileTextOutlined,
  CoffeeOutlined,
  AudioOutlined
} from '@ant-design/icons';

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

const { Header, Sider, Content, Footer } = Layout;

export default function SiderDemo() {
  const [collapsed, SetCollapsed] = useState(false);
  
 const toggle = () => {
     SetCollapsed(!collapsed)
  }
 


  return (
    <>
     
    <BrowserRouter>
      <Layout >
    
        <Sider className='sider' collapsible trigger={null} breakpoint='lg' onBreakpoint={toggle} >
        
          <Menu className='menu'  mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}>
              <Link to="/advise">排行榜</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={ <CoffeeOutlined /> }>
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
              }} />
            </Col>
            <Col span={6}></Col>
            <Col><Button type="primary" style={{
            }}><Link to="/login">登入</Link></Button><Button><Link to="/register">注册</Link></Button></Col></Row>
          </Header>
          <Content
            className="site-layout-background"
            style={{
             
              margin: '24px 16px',
              padding: 24,
              minHeight: 800,
            }}
          >
          
           
              <Route path='/' exact render={() =><InfiniteListExample/>}></Route>
          
            <Route path='/advise' exact render={() => <Advise />}></Route>
            <Route path='/tea' exact render={() => <Tea />}></Route>
            <Route path='/login' exact render={() =>  <Login/>}></Route>
             <Route path='/register' exact render={() =>  <Register/>}></Route>
            <Route path='/detail' exact render={() =>  <Detail/>}></Route>
            <Route path='/update' exact render={() =>  <Update/>}></Route>
            <Route path='/new' exact render={() =>  <New/>}></Route>             
             
          </Content>
          <Footer style={{ textAlign: 'center' }}>BBBlog ©2020 Created by kunpeng</Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
    </>
  );


}


```



在src/index.tsx中引入







```tsx
import React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import Sider from './components/menu' 
export default function App() {
  return (
    <div>
        <Sider/>
    </div>
  )
}

ReactDOM.render(
    
    <App />
  ,
  document.getElementById('root')
);
```



编写对应的css文件

在src中新建style文件夹，新建menu.css文件







```css
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  
  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }
  
  #components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  
  .site-layout .site-layout-background {
    background: #fff;
   
  }
  .ant-layout-sider-children{
    background: #fff;
  }
  
  .site-layout{
    display:flex;
  }
  
```



在index.css引入

```css
@import './style/menu.css';
```



### 编写注册组件

新建register.tsx文件



```tsx
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios'
const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleRegister = () => {
       
        axios.post('/api/user/register',{
            username,password
        })
        .then(resp => resp.data)
        .then(resp => {
          if (resp) {
            alert(`注册成功，快去登入吧`)
          } else {
            alert(`注册失败`)
          }
        })
        
      
    } 
    return (
        <Form
          
            name="basic"
            layout='inline'
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
                        message: '请输入你的用户名!',
                    },
                ]}
            >
                <Input onChange={e => {

                    setUsername(e.target.value)
                }} />
            </Form.Item>

            <Form.Item
                label="密码"
                name="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入你的密码!',
                    },
                ]}
            >
                <Input.Password onChange={e => {

                    setPassword(e.target.value)
                }} />
            </Form.Item>
            <Form.Item >
                <Button  htmlType="submit" onClick={handleRegister}>
                    注册
        </Button>
            </Form.Item>
        </Form>
    );
};



export default Register;
```



### 编写登入组件

新建login.tsx 文件







```tsx
import React, {useState}from 'react';
import { Form, Input, Button} from 'antd';
import axios from 'axios'


const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
 
   const handleLogin = () =>{
    axios.post(`/api/user/login`,{
     username,password
    }).then(resp => {
       
    if (resp.data.success) {
      console.log(resp.data)
           localStorage.setItem('author',resp.data.author)       
          alert(`登录成功`)
       }
       
       else {
        alert(`登录失败`)
       }
     })}
   
  return (
    <Form
     
      name="basic"
      initialValues={{
        remember: true,
      }}
      layout='inline'
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入你的用户名',
          },
        ]}
      >
        <Input  onChange={e => {
                  
                  setUsername(e.target.value)
                }}/>
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入你的密码',
          },
        ]}
      >
        <Input.Password onChange={e => {
                  
                  setPassword(e.target.value)
                }}/>
      </Form.Item>


      <Form.Item >
        <Button type="primary" htmlType="submit"onClick={handleLogin}>
          登入
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
```



### 编写博客列表组件

新建CardList.tsx文件







```tsx
import React from 'react'
import axios from 'axios'
import { List, message, Avatar, Spin, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';


export class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
    author:localStorage.getItem('author')
  };

  componentDidMount() {
    this.fetchData.then(res => {

      this.setState({
        data: res.list,
      });

    });
  }

  fetchData = axios.get('/api/blog/list').then(res => res.data
  )
  renderRow(item) {
  return (
    <div key={item.id} className="row">
      <div className="image">
       
      </div>
      <div className="content">
        <div>{item.title}</div>
        <div className='content'>{item.content.substring(0,100).concat('...')}</div>
        <div className='author'>by   {item.author}</div>
        <Button type="dashed"><Link to={`/detail?${item.id}`}>点击查看详情</Link></Button>
      </div>
    </div>
  );
}


  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 14) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.fetchData.then(res => {
      data = data.concat(res);
      this.setState({
        data,
        loading: false,
      });
    });
  };

  render() {
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <div className="list">
        {this.state.data.map(this.renderRow.bind(this))}
      </div>
        </InfiniteScroll>
        <Button>  {this.state.author ? <Link to='new'>点击新增博客</Link> : '请先登入才能新增博客哦'} </Button>
      </div>
    );
  }

}





```



编写对应的css文件

在src/style文件夹下新建文件CardList.css

```css

  .list {
  padding: 10px;
}
  .content
{
text-overflow:ellipsis;
}
.author{
  position:relative;
  left:10px;
}
.row { 
  border-bottom: 1px solid #ebeced;
  text-align: left;
  margin: 5px 0;
  display: flex;
  align-items: center;
}

/* .image {
  margin-right: 10px;
} */

.content {
  padding: 10px;
}

```



在index.css中新增引入







```css
@import './style/Cardlist.css';
```



### 编写博客详情页组件

新建detail.tsx 文件









```tsx
import React, { useState } from 'react'
import axios from 'axios'
import {Col,Row, Button, Alert} from 'antd'
import { Link } from 'react-router-dom';
export default function Detail() {
    let list = window.location.search.split('?');
    let id = list[1];
    
    const  Author = localStorage.getItem('author')
    const [author, setAuthor] = useState('');
    const [content, SetContent] = useState("");
    const [title, setTitle] = useState('')
    axios.get(`/api/blog/detail?id=${id}`).then(
      res => res.data
    ). then(res => {
       setAuthor(res.author)
     
  
      setTitle(res.title)
       SetContent(res.content)

   })
    const handleDel =()=>{
          
                axios(`/api/blog/del?id=${id}`).then(
            res=>res.data
        )
        .then(
               res=>{
                   if(res.success){
                       alert('删除成功')
                   }else{
                       alert('删除失败')
                   }
               }
            )
            
        
          
        
       
    }

    return (<div>
       <Row align='middle'justify='center'><h2 className="title">{title}</h2></Row> 
       <Row><div><span style={{
           color:'grey',
           fontSize:'12px'
       }}> write By {author}</span><span style={{
        color:'grey',
        fontSize:'12px'
    }}> </span></div></Row> 
    <br/>
    <br/>
        <div><p>{content}</p></div>
       <Button>{Author===author?<Link to={`/update?${id}`}>更新</Link>:''}</Button> 
        <br/>
         {Author===author?<Button onClick={handleDel}>删除 </Button>:<div></div>}

        
       
    </div>

    )
}
```



###  编写更新博客组件

新建update组件



```tsx
import React, { useState, useContext } from 'react'
import { Input,Button } from 'antd';
import axios from 'axios'
export default  function Update(){
    let list = window.location.search.split('?');
    let id = list[1];
    const { TextArea } = Input;
    const [title,SetTitle]=useState('')
    const [content,SetContent]=useState('')
    //  const [author,SetAuthor]=useState('')
     const author = localStorage.getItem('author')
    const HandleUpdate=()=>{
        axios(`/api/blog/update?id=${id}&title=${title}&content=${content}&author=${author}`,).then(res=>res.data
        ).then(res=>{
          // console.log(res)
            if(res){
                alert('更新成功')
            }
            else{
                alert('更新失败')
            }
        }
          
        )
    }
   

    return(
        <div> <Input onChange={e=>{SetTitle(e.target.value)}}  placeholder="请输入标题" />
         {/* <Input onChange={e=>{SetAuthor(e.target.value)}}  placeholder="请输入作者姓名" /> */}
        <TextArea onChange={e=>{SetContent(e.target.value)}} rows={4} placeholder='请输入内容'/>
       
       <Button onClick={HandleUpdate}>提交更新</Button></div>
    )}
```



### 编写新增博客组件

新建new.tsx文件







```tsx
import React, { useState, useContext } from 'react'
import { Input,Button } from 'antd';
import axios from 'axios'
export default  function New(){
    const { TextArea } = Input;
    const [title,SetTitle]=useState('')
    const [content,SetContent]=useState('')
    
    const author = localStorage.getItem('author')
    const HandleUpdate=()=>{
        axios(`/api/blog/new?title=${title}&content=${content}&author=${author}`).then(res=>
          res.data
         
        )
        .then(res=>{
          
             if(res.success){
                 alert('新增成功')
             }
             else{
                 alert('新增失败')
             }
         }
          
         )
    }
   

    return(
        <div> <Input onChange={e=>{SetTitle(e.target.value)}}  placeholder="请输入标题" />
        {/* <Input onChange={e=>{SetAuthor(e.target.value)}}  placeholder="请输入作者姓名" /> */}
        <TextArea onChange={e=>{SetContent(e.target.value)}} rows={4} placeholder='请输入内容'/>
       
       <Button onClick={HandleUpdate}>提交</Button></div>
    )}
```



### 编写说明组件

新建文件Tea.tsx







```tsx
import React, { useState } from 'react'
import { Alert } from 'antd'
export default  function Tea(){
    return(
     <div>
       <Alert
      message="请注意"
      description="不要发不良的信息呦!"
      type="info"
      showIcon
    />
    <br/>
        <h1>这个blog有很多不足</h1>
          <h1>但俺才快大二，有时间去升级和维护</h1>
        <h1>求大家点赞^ ^</h1></div>
    )}
```



### 编写统计博客数量的组件

新建文件Advise.tsx







```JavaScript
import React, { useState,useRef,useEffect } from 'react'
import Bar from '../echarts/bar'


export default  function Advise(){ 
    return(
        <div> 
         
          <Bar/>
          
    
    
    </div>
    )}
```



### 

在src下新建echarts文件夹，新建文件bar.jsx







```jsx
import React, { useState } from 'react'
import {Card} from 'antd'
import axios from 'axios'
import echarts from 'echarts'
import ReactEcharts  from 'echarts-for-react'
import { useEffect } from 'react'


export default  function Bar (){
  const  [keys,setKeys] = useState([]);
   const  [ values ,setValues] = useState([]); 
   echarts.registerTheme('my_theme', {
  backgroundColor: '#f0ffff'
});
 useEffect(()=>{
  
 axios.get('/api/blog/list').then(res => res.data.list).then(res=>res.map(item=>item.author)).then(res=>res.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {})).then(res=>{
 setKeys(Object.keys(res)) 

   setValues(Object.values(res))
   
})
 
},[])


 function getOption(){
   let option = {
            title: {
                text: '发布博客文章数量'
            },
            tooltip: {},
            xAxis: {
                data: keys
            },
            yAxis: {},
            series: [{
                name: '数量',
                type: 'bar',
                data: values
            }]
        };
    
   return option
}
 



  return(
    <div>
     <Card title='来看看发布文章的数量吧'>

       <ReactEcharts option={getOption()} theme={"theme_name"}/>
     </Card>

    </div>
  )
}
```



ok，至此我们开发完毕了

终端中输入







```
npm run dev 
```



来看看效果吧

## 部署上线

注意部署之前先把文件克隆到本地，以防丢失

点左侧第一个部署按钮，首先选择日常环境，点击与文件同步，自动拉取f.yml的配置，如果不行，手动配置一下~，之后点击部署。

![Snipaste_2020-11-05_21-59-03.png](https://i.loli.net/2020/11/07/9eqAHFlIRfCK4Vp.png)

之后预发环境与线上环境与之一样，按顺序即可。部署成功后，会给出一个免费的临时测试域名用于访问部署到线上的效果。

如果你要用自己的域名长期访问，可以参见以下文档继续在线上环境进行部署和发布上线。https://help.aliyun.com/document_detail/176711.html

## 总结

参加训练营，让我受益良多，感受到serverless的强大之处

serverless 大大降低了开发的成本和上线周期。

而且免运维 (服务器运维、容量管理、弹性伸缩等)，按资源的使用量付费使得上线后的成本极低

上线地址 http://bk.ckpbk.top/

项目github地址   https://github.com/JokerChen-peng/BBBlog_midway

由于笔者才疏学浅，这个项目的代码肯定很多优化的空间，欢迎大家来帮我找bug和重构O(∩_∩)O哈哈~


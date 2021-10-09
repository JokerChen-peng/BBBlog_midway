import React, { useState } from "react";
import { Col, Row, Button, Alert } from "antd";
import { Link } from "react-router-dom";
import { getBlogDetail, deleteBlog } from "../utils/request";
export default function Detail() {
  let list = window.location.search.split("?");
  let id = list[1];
  const Author = localStorage.getItem("author");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  getBlogDetail(id).then((res) => {
    setAuthor(res.author);
    setTitle(res.title);
    setContent(res.content);
  });
  const handleDel = () => {
    deleteBlog(id)
      .then((res) => {
        if (res.success) {
          alert("删除成功");
        } else {
          alert("删除失败");
        }
      });
  };

  return (
    <div>
      <Row align="middle" justify="center">
        <h2 className="title">{title}</h2>
      </Row>
      <Row>
        <div>
          <span
            style={{
              color: "grey",
              fontSize: "12px",
            }}
          >
            {" "}
            write By {author}
          </span>
          <span
            style={{
              color: "grey",
              fontSize: "12px",
            }}
          >
            {" "}
          </span>
        </div>
      </Row>
      <br />
      <br />
      <div>
        <p>{content}</p>
      </div>
      <Button>
        {Author === author ? <Link to={`/update?${id}`}>更新</Link> : ""}
      </Button>
      <br />
      {Author === author ? (
        <Button onClick={handleDel}>删除 </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}

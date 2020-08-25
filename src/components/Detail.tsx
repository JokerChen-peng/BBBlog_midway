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
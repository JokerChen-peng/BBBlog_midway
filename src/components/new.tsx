import React, { useState, useContext } from 'react'
import { Input,Button } from 'antd';
import axios from 'axios'
export default  function New(){
    const { TextArea } = Input;
    const [title,SetTitle]=useState('')
    const [content,SetContent]=useState('')
    //  const [author,SetAuthor]=useState('')
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
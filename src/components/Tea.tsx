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
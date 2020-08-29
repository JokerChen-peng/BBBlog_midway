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
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
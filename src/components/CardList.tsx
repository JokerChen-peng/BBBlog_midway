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





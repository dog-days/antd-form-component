import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
// import classnames from 'classnames';

import 'antd/dist/antd.css';
import 'src/style/css/layout-main.less';
import 'antd-form-component/assets/css/style.less';

class MainLayout extends React.Component {
  renderItem(title, viewId) {
    return (
      <Menu.Item key={viewId}>
        <Link to={`/main/${viewId}`}>{title}</Link>
      </Menu.Item>
    );
  }
  render() {
    const { children, params } = this.props;
    return (
      <div className="layout-container">
        <Menu selectedKeys={[params.viewId]} mode="horizontal">
          {this.renderItem('基本使用', 'index')}
          {this.renderItem('自定义联动', '')}
        </Menu>
        <div className="main-contents">{children}</div>
      </div>
    );
  }
}

export default MainLayout;

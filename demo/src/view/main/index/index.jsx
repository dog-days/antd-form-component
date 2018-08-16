import React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import FormComponent from './component';

class IndexView extends React.Component {
  state = {};
  render() {
    console.debug('index页面');
    return (
      //antd v3.x.x默认的多语言是英文
      <LocaleProvider locale={zhCN}>
        <div>
          {/* <button
            onClick={() => {
              this.setState({ loading: true });
            }}
          >
            test
          </button> */}
          <FormComponent />
        </div>
      </LocaleProvider>
    );
  }
}

export default IndexView;

import React from 'react';
import { LocaleProvider } from 'antd';
import { Form, Input } from 'antd-form-component';

const data = [];
for (let i = 0; i < 1; i++) {
  data.push(i);
}
@Form.create()
class IndexView extends React.Component {
  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({
      email: 'email@qq.com',
      url: 'http://www.localhost.com',
    });
  }
  render() {
    console.debug('index页面');
    const { form } = this.props;

    return (
      <LocaleProvider>
        <div>
          {true && (
            <button
              onClick={() => {
                const values = form.getFieldsValue();
                const errors = form.getFieldsError();
                console.log(values, errors);
                // form.resetFields(['test2']);
              }}
            >
              test
            </button>
          )}
          <Form
            onSubmit={e => {
              e.preventDefault();
              form.validateFields((err, values) => {
                console.log(err, values);
              });
            }}
            hasFeedback
            size="default"
          >
            {true && <button>提交</button>}
            <Input
              name="text"
              value="葛新安"
              required
              placeholder="test"
              label="姓名"
            />
            <Input label="邮箱" name="email" required type="email" />
            <Input label="网址" name="url" required type="url" />
            <Input label="上传" name="file" required type="file" />
            <Input.TextArea autosize label="描述" name="textarea" required />
            {data.map((v, k) => {
              return (
                <Input
                  label={'testt' + k}
                  name={'testt' + k}
                  required
                  type="url"
                  key={k}
                />
              );
            })}
          </Form>
        </div>
      </LocaleProvider>
    );
  }
}

export default IndexView;

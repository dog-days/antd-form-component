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
      test2: 'email@qq.com',
      test3: 'http://www.localhost.com',
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
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
          >
            {true && <button>提交</button>}
            <Input
              name="test"
              value={222}
              required
              placeholder="test"
              label="姓名"
            />
            <Input label="test2" name="test2" required type="email" />
            <Input label="file" name="test222" required type="file" />
            <Input label="test3" name="test3" required type="url" />
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

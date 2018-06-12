import React from 'react';
import moment from 'moment';
import { LocaleProvider, Button } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  DatePicker,
  Checkbox,
  Radio,
  Cascader,
  Password,
  // ArrayInput,
} from 'antd-form-component';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

@Form.create()
class IndexView extends React.Component {
  state = {};
  componentDidMount() {
    // const { form } = this.props;
    // form.setFieldsValue({
    //   email: 'email@qq.com',
    //   url: 'http://www.localhost.com',
    // });
  }
  getCascaderOptions() {
    return [
      {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
          {
            value: 'hangzhou',
            label: 'Hangzhou',
            children: [
              {
                value: 'xihu',
                label: 'West Lake',
              },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];
  }
  render() {
    console.debug('index页面');
    const { form } = this.props;
    const dateFormat = 'YYYY/MM/DD';
    const monthFormat = 'YYYY/MM';

    return (
      //antd默认的多语言是英文，设置为中文如下
      <LocaleProvider locale={zhCN}>
        <div>
          <Form
            onSubmit={e => {
              e.preventDefault();
              form.validateFields((err, values) => {
                console.log(err, values);
              });
            }}
            hasFeedback
            size="default"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {true && (
              <Button
                type="primary"
                style={{ width: '100%', marginTop: 20 }}
                onClick={() => {
                  const values = form.getFieldsValue();
                  const errors = form.getFieldsError();
                  console.log(values, errors);
                }}
              >
                获取表单值和错误提示（错误需要触发，请查看console）
              </Button>
            )}
            {true && (
              <Button
                type="primary"
                style={{ width: '100%', marginTop: 20 }}
                onClick={() => {
                  form.resetFields();
                }}
              >
                重置
              </Button>
            )}
            {true && (
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: '100%', margin: '20px 0' }}
              >
                提交
              </Button>
            )}
            <Input name="text" required label="Text" value="text" />
            <InputNumber label="InputNumber" name="input-number" required />
            <Input label="Email" name="email" required type="email" />
            <Input label="Url" name="url" required type="url" />
            <Input label="File" name="file" required type="file" />
            <Input.TextArea autosize label="描述" name="textarea" required />
            <Password name="parssword" label="密码" required checkPassword />
            <Input.Group compact label={'InputGroup'}>
              <Select name="address-type" style={{ width: '30%' }} value="Home">
                <Option value="Home">Home</Option>
                <Option value="Company">Company</Option>
              </Select>
              <Input
                name="info"
                style={{ width: '70%' }}
                placeholder="请填写留言"
                required
                min={2}
              />
            </Input.Group>
            <Checkbox.Group
              label="CheckboxGroup"
              name="checkboxgroup"
              options={[
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
              ]}
              value={['Pear']}
              required
            />
            <Radio.Group label="RadioGroup" name="radiogroup" value={1}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
            <Select
              //selet设置props.mode后回车都会触发提交表单，这个是antd默认行为
              label="Single Select"
              name="single-select"
              required
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select label="Group Select" name="group-select" required>
              <OptGroup label="Manager">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </OptGroup>
              <OptGroup label="Engineer">
                <Option value="Yiminghe">yiminghe</Option>
              </OptGroup>
            </Select>
            <Select
              mode="multiple"
              label="Multiple Select"
              name="multiple-select"
              required
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select mode="tags" label="Tags Select" name="tags-select" required>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select
              mode="combobox"
              label="combobox Select"
              name="combobox-select"
              required
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <TimePicker
              label="TimePicker"
              name="timepicker"
              value={moment('00:00:00', 'HH:mm:ss')}
              required
            />
            <DatePicker
              label="DatePicker"
              name="datepicker"
              value={moment('2015/01/01', dateFormat)}
              format={dateFormat}
              required
            />
            <DatePicker.MonthPicker
              label="MonthPicker"
              name="monthpicker"
              value={moment('2015/01', monthFormat)}
              format={monthFormat}
              required
            />
            <DatePicker.RangePicker
              label="RangePicker"
              name="rangepicker"
              format={dateFormat}
              value={[
                moment('2015/01/01', dateFormat),
                moment('2015/02/01', dateFormat),
              ]}
              required
            />
            <DatePicker.WeekPicker
              label="WeekPicker"
              name="weekpicker"
              required
            />
            <Cascader
              name="cascader"
              label="Cascader"
              required
              options={this.getCascaderOptions()}
            />
          </Form>
        </div>
      </LocaleProvider>
    );
  }
}

export default IndexView;

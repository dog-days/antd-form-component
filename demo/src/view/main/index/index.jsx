import React from 'react';
import moment from 'moment';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {
  Form,
  Input,
  Select,
  TimePicker,
  DatePicker,
  Checkbox,
  Radio,
} from 'antd-form-component';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

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
    const dateFormat = 'YYYY/MM/DD';
    const monthFormat = 'YYYY/MM';

    return (
      //antd默认的多语言是英文，设置为中文如下
      <LocaleProvider locale={zhCN}>
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
            <Select
              //selet设置props.mode后回车都会触发提交表单，这个是antd默认行为
              label="单选Select"
              name="single-select"
              required
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select
              mode="multiple"
              label="多选Select"
              name="multiple-select"
              required
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select mode="tags" label="标签Select" name="tags-select" required>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            <Select label="分组Select" name="group-select" required>
              <OptGroup label="Manager">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
              </OptGroup>
              <OptGroup label="Engineer">
                <Option value="Yiminghe">yiminghe</Option>
              </OptGroup>
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

# antd-form-component

 [![npm package](https://badge.fury.io/js/antd-form-component.svg)](https://www.npmjs.org/package/antd-form-component) [![NPM downloads](http://img.shields.io/npm/dm/antd-form-component.svg)](https://npmjs.org/package/antd-form-component)

> 本项目重构于[antd-react-form-builder](https://github.com/dog-days/antd-react-form-builder)，删除了嵌套表单，优化了组件用法。

之所以写了这个项目有以下几点原因：

- [Antd](https://ant.design/docs/react/introduce)的表单验证是会触发整个组件渲染，（使用Form.create()装饰器后和getFieldDecorator后）
- 默认的Antd表单组件是不自带验证的，需要使用配套的getFieldDecorator装饰过后才可以验证。

基于以上原因，就有了本项目。

## 安装

目前只支持通过npm安装。

```sh
npm install antd-form-component --save
```

## 兼容

### 依赖包

antd支持到v2.x.x，react支持v15.x.x。

> antd@3.x.x有一个bug，select的mode="tags"和mode="combobox"回车会触发form提交。
>
> antd@2.x.x没有这种问题。

### 浏览器

兼容IE11以上，兼容谷歌、Safari、火狐等浏览器最新版本。

IE11需要使用polyfills，可以使用下面的：

```js

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object.assign');
//兼容父类构造器不运行问题
(function() {
  var testObject = {};
  if (!(Object.setPrototypeOf || testObject.__proto__)) {
    var nativeGetPrototypeOf = Object.getPrototypeOf;

    Object.getPrototypeOf = function(object) {
      if (object.__proto__) {
        return object.__proto__;
      } else {
        return nativeGetPrototypeOf.call(Object, object);
      }
    };
  }
})();
//兼容startsWith问题
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(prefix) {
    return this.slice(0, prefix.length) === prefix;
  };
}
```

需要安装相应的包。

```sh
npm i -S promise object.assign
```

## 使用

`antd-form-component`是基于antd form进行了一些简便封装，具体antd from用法还是要使用者自己去了解，这里就不多说。`antd-form-component`的表单项都包含了antd 的`<FormItem \>`，表单验证直接通过表单组件props.rules传进来。详细的说明请看下面的**API**。

可以直接参考本项目中的demo。

需要而外引入css文件

```js
import "antd/dist/antd.css";
import 'antd-form-component/lib/assets/css/style.css';
//也可以直接使用less
//import 'antd-form-component/lib/assets/css/style.less';
```

如果使用`antd@2.x.x`版本，需要而外引入下面的css。

```jsx
import 'antd-form-component/lib/assets/css/style@2.x.x.css';
//也可以直接使用less
import 'antd-form-component/lib/assets/css/style@2.x.x.less';
```

**简单使用**

```jsx
import React from 'react';
import { Form, Input } from 'antd-form-component';
import { Button } from 'antd';

import "antd/dist/antd.css";
import 'antd-form-component/lib/assets/css/style.css';

@Form.create()
class Test extends React.Component {
  render() {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.validateFields((err, values) => {
            console.log(err, values);
          });
        }}
        hasFeedback
        size="default"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Input name="text" required label="Text" value="text" />
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form>
    );
  }
}
```

## 国际化

 `antd/lib/locale-provider/zh_CN`结构如下：

```js
//afc前缀是antd-form-component的首字母缩写
//避免跟antd的命名重复
export default {
  afcCommon: {
    isRequired: '请输入%s',
    //中文字符算两个英文字符
    charactersBetwteen: '请输入%d到%d个长度的字符',
    charactersMin: '字符长度不能小于%d',
    charactersMax: '字符长度不能大于%d',
    charactersOnlyLetter: '请输入英文字母',
  },
  afcInput: {
    emailFormat: '电子邮件格式不正确',
    urlFormat: 'url格式不正确',
  },
  afcPassword: {
    checkLabel: '确认密码',
    checkErrorMsg: '您两次输入的密码不一致',
    formatErrorMsg: '密码必须是字母和数字结合',
  },
};

```

### 全局

跟antd的国际化用法一致，请参考[https://ant.design/docs/react/i18n-cn](https://ant.design/docs/react/i18n-cn)。

```jsx
import React from 'react';
import { LocaleProvider } from 'antd';
import AntdEnUS from 'antd/lib/locale-provider/en_US';
import AntdFormComponentENUS from 'antd-form-component/lib/locale-provider/es_US';
//整合Antd和Form的国际化语言
let enUS = Object.assign({},AntdEnUS,AntdFormComponentENUS);
class Test extends React.Component {
	return (
    <LocaleProvider locale={enUS}>
      <App />
    </LocaleProvider>
  );
  
}
```

### 通过Form

```jsx
import React from 'react';
import { Form, Input } from 'antd-form-component';
import AntdFormComponentENUS from 'antd-form-component/lib/locale-provider/es_US';

import "antd/dist/antd.css";
import 'antd-form-component/lib/assets/css/style.css';

@Form.create()
class Test extends React.Component {
  render() {
    return (
      <Form locale={AntdFormComponentENUS}>
        <Input name="text" required label="Text" value="text" />
      </Form>
    );
  }
}
```

### 通过单个组件

```jsx
import React from 'react';
import { Form, Input } from 'antd-form-component';
import AntdFormComponentENUS from 'antd-form-component/lib/locale-provider/es_US';

import 'antd/dist/antd.css';
import 'antd-form-component/lib/assets/css/style.css';

@Form.create()
class Test extends React.Component {
  render() {
    return (
      <Form>
        <Input
          name="email"
          required
          label="Email"
          type="email"
          locale={{ emailFormat: '电子邮件格式不正确' }}
        />
      </Form>
    );
  }
}
```

## API

>主页所有antd-form-component组件都是不可控组件，只能通过Form.create()提供的this.props.form进行各种处理。

> 处理Form组件外，每个组件默认都包含antd Form.Item。

**除了新增的props进行说明，其他的没有新增的都跟原来的antd表单组件一致。**

### Form

```jsx
<Form
  onSubmit={ this.handleOnsubmit }
  size="default"
  hasFeedback={ false }
>
  <Input name="test"/>
</Form>
```

| props       | 说明                                                         | 类型    | 必填 | 默认值  |
| ----------- | ------------------------------------------------------------ | ------- | ---- | ------- |
| size        | 统一设置组件size                                             | string  | 否   | default |
| hasFeedback | 统一设置组件的hasFeedback                                    | boolean | 否   | false   |
| labelCol    | 统一设置组件的labelCol                                       | object  | 否   | 无      |
| wrapperCol  | 统一设置组件的wrapperCol                                     | object  | 否   | 无      |
| 其他props   | 其他props完全跟antd [Form](https://ant.design/components/form-cn/#Form)一致 |         |      |         |

上面的props优先级是最低的，组件传递的props可覆盖上面的属性，如：

```jsx
<Form
  size="default"
  labelCol={{ span: 4 }}
  wrapperCol={{ span: 20 }}
  hasFeedback
>
  <Form.Item  
    hasFeedback={false} 
    labelCol={{ span: 2 }}
  	wrapperCol={{ span: 22 }}
  >
  	<Input name="test" size="small"/>
  </Form.Item>
</Form>
```

### Form.create()

基本跟antd的[Form.create()](https://ant.design/components/form-cn/#Form.create(options))一样。

这里出`Form.create()`没有options参数。

| 方法              | 说明                                                         | 类型                                                         |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| getFieldDecorator | 用于和表单进行双向绑定，详见下方描述                         |                                                              |
| getFieldError     | 获取某个输入控件的 Error                                     | Function(name)                                               |
| getFieldsError    | 获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error | Function([names: string[]])                                  |
| getFieldsValue    | 获取一组输入控件的值，如不传入参数，则获取全部组件的值       | Function([fieldNames: string[]])                             |
| getFieldValue     | 获取一个输入控件的值                                         | Function(fieldName: string)                                  |
| resetFields       | 重置一组输入控件的值（为 `initialValue`）与状态，如不传入参数，则重置所有组件 | Function([names: string[]])                                  |
| setFields         | 设置一组输入控件的值与 Error                                 | Function({ fieldName:{ value: any, errors: Error } })        |
| setFieldsValue    | 设置一组输入控件的值（注意：不要在 `componentWillReceiveProps` 内使用，否则会导致死循环） | Function({ fieldName:value }                                 |
| validateFields    | 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件 | Function([fieldNames: string[]], options: object, callback: Function(errors, values)) |

除了`getFieldDecorator`用法跟antd的不一样，上面其他方法的用法一样。

#### getFieldDecorator(id, props) 

getFieldDecorator跟antd的用法不一样。

一般都用不上这个函数，除非需要新定义组件，如：

```jsx
form.getFieldDecorator('inputnumber', {
  	//这些是props参数
    label: 'inputnumber',
    initialValue: '2',
    required: true,
 })(<Antd.InputNumber />)
//这个跟<AntdFormComponent.InputNumber />是一样的。
```

props参数跟组件的一样，详细请参考下面**表单组件公共props**。

### Form.Item

`antd-form-component`也提供了`Form.Item`作为传递props到antd的`Form.Item`（每个`antd-form-component`组件都是包含了antd的`From.Item`）。

```jsx
<Form>
  <Input
    name="email"
    required
    label="Email"
    type="email"
    locale={{ emailFormat: '电子邮件格式不正确' }}
  />
</Form>
```

上面的代码跟下面代码作用是一样的，不过多了一项可以传递props到antd的`Form.Item`。

```jsx
<Form>
	<Form.Item 
  	//这里面可以传递prop到  
    hasFeedBack
  >
    <Input
      name="email"
      required
      label="Email"
      type="email"
      locale={{ emailFormat: '电子邮件格式不正确' }}
    />
  </Form.Item>
</Form>
```



### 表单组件公共props

| props      | 说明                                                         | 类型    | 必填 | 默认值 |
| ---------- | ------------------------------------------------------------ | ------- | ---- | ------ |
| name       | input、select等的的name（跟原生的html一样），同时async-validator要用到（表单验证），取值要用到，要唯一。 | string  | 是   | 无     |
| label      | 表单项左边的展示名称                                         | string  | 否   | 无     |
| value      | 初始化的value设置，**这里没有`defaultValue`的概念**。        |         |      |        |
| required   | 表单项是否必填（这个验证会合并到rules中的）                  | boolean | 否   | 无     |
| rules      | 验证规则请参考下面`props.rules`的说明。                      | array   | 否   | 无     |
| noFormItem | 是否渲染antd的`Form.Item`                                    |         |      |        |
| 其他props  | 其他props继承antd的中相应的表单组件，`defualtValue`除外。    |         |      |        |

`props.rules`大致结构如下，更高级请参考 [async-validator](https://github.com/yiminghe/async-validator)。

```js
[
  //async-validator自带的验证规则
  { type: "string", required: true,message: "必填项"},
  //自定义验证规则
  {
    validator(rule, value, callback, source, options) {
      var errors = [];
      // test if email address already exists in a database
      // and add a validation error to the errors array if it does
      callback(errors);
    }
  }
]
```

### 新增props的组件

#### Input

```jsx
<Input name="text" required label="Text" value="text" />
<Input label="Email" name="email" required type="email" />
<Input label="Url" name="url" required type="url" />
<Input label="File" name="file" required type="file" />
<Input.TextArea autosize label="描述" name="textarea" required />
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
```

**新增的props:**

| props      | 说明                   | 类型    | 必填 | 默认值 |
| ---------- | ---------------------- | ------- | ---- | ------ |
| type       | 表单子项类型           | string  | 否   | text   |
| onlyLetter | 是否只允许输入英文字母 | boolean | 否   | false  |
| min        | 输入字符最小长度       | number  | 否   | 无     |
| max        | 输入字符最大长度       | number  | 否   | 无     |

其他参考[Antd.Input](https://ant.design/components/input-cn/)。

公共部分的props请参考，**表单组件公共props**。

**type类型如下：**

| type类型 | 说明              |
| -------- | ----------------- |
| email    | 自带email格式验证 |
| url      | 自带urll格式验证  |
| hidden   | 隐藏Input         |

还有`Input.TextArea`、`Input.Search` 、`Input.Group`用法都跟antd的一样。

### 新增组件

#### ArrayInput

```jsx
<ArrayInput name="array" required label="Array" value={[1, 2, 3]} />
```

**props**

| props     | 说明                                 | 类型               | 默认值 |
| --------- | ------------------------------------ | ------------------ | ------ |
| value     | value值                              | string <br />array | 无     |
| 其他props | 继承antd-form-component `Input`props |                    |        |

#### Password

```jsx
<Password required label="密码" checkPassword/>
```

**props**

| props               | 说明                                                         | 类型    | 默认值   |
| ------------------- | ------------------------------------------------------------ | ------- | -------- |
| type                | 使用配置时**必填**，直接使用JSX可选。type取值`password`，只有一种值。 | string  | password |
| checkPassword       | 是否重复验证密码                                             | boolean | false    |
| onlyLetterAndNumber | 只允许输入英文字母和数字结合的密码                           | boolean | true     |
| 其他props           | 继承antd-form-component `Input`props                         |         |          |




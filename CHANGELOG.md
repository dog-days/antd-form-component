## 0.0.10(2019-02-14)

### Bug Fix

- 解决 getFieldsValue validateFields 中 form values 会被使用者覆盖的情况

### Update

无

### New Function

无

## 0.0.9(2018-12-29)

### Bug Fix

- 解决 getFieldsValue validateFields 中 form values 会被使用者覆盖的情况

### Update

无

### New Function

无

## 0.0.8(2018-12-28)

### Bug Fix

无

### Update

- 兼容空 input 值为字符串，同时优化了 array input

### New Function

无

## 0.0.7(2018-12-06)

### Bug Fix

-

### Update

- InputNumber 为必填时，如果设置了最小值，空值强制设置为最小值。

### New Function

- <Input /> 新增只允许中文验证: `onlyChinese`

## 0.0.6(2018-12-03)

### Bug Fix

- 解决 i18n 不正确问题
- 解决 InputNubmer min max 不生效问题

### Update

无

### New Function

- InputNumber required 设置时，空值强制设置为 0。

## 0.0.5(2018-12-03)

### Bug Fix

- 解决 form 组件 value 为 0 和空值，获取不到值的问题

### Update

无

### New Function

无

## 0.0.4(2018-12-02)

### Bug Fix

- 解决 select 为空值，选择为空的问题

### Update

-

### New Function

- 添加 initialValue 替换废弃 value 的用法

- 为\<Input /\> 添加 onlyLetterAndNumber 属性

## 0.0.3(2018-08-16)

### Bug Fix

- 解决父组件 setState，form 组件会销毁重新渲染的问题

### Update

无

### New Function

无

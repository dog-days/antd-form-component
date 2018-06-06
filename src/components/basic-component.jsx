//外部依赖包
import React from 'react';

import defaultRulesDecorator from '../decorator/defaultRules';
import validateDecorator from '../decorator/validate';
import commonContextDecorator from '../decorator/commonContext';
import pureRenderWithLodashDecorator from '../decorator/pureRenderWithLodash';

//防止被重复渲染
@pureRenderWithLodashDecorator
//验证name等值是否定义
@validateDecorator
//默认的一些rules，如required
@defaultRulesDecorator
//公共的context
@commonContextDecorator
export default class Input extends React.Component {
  //定义组件类型
  componentType = 'text';
  //定义当前需要用到的antd表单组件
  currentAntdComponent = <span />;
  //设置特殊的async-validator rules
  getSepcialRuleByType() {
    return [];
  }
  render() {
    if (!this.context.form) {
      //如果没有使用Form.create()
      return <this.currentAntdComponent {...this.props} />;
    }
    const { getFieldDecorator } = this.context.form;
    let { children, name, value, rules = [], ...other } = this.props;
    const specialRules = this.getSepcialRuleByType(other.type);
    if (other.type === 'email' || other.type === 'url') {
      other.type = 'text';
    }
    if (!other.type && this.componentType) {
      //处理checkbox等
      other.type = this.componentType;
    }
    return getFieldDecorator(name, {
      initialValue: value,
      rules: [
        ...this.getDefaultRules(
          other.type,
          this.locale,
          other.label ? other.label : name
        ),
        ...specialRules,
        ...rules,
      ],
    })(
      <this.currentAntdComponent {...other}>
        {children}
      </this.currentAntdComponent>
    );
  }
}

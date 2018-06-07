//外部依赖包
import React from 'react';
import PropTypes from 'prop-types';

import defaultRulesDecorator from '../decorator/defaultRules';
import validateDecorator from '../decorator/validate';
import commonContextDecorator from '../decorator/commonContext';
// import pureRenderWithLodashDecorator from '../decorator/pureRenderWithLodash';

//防止被重复渲染
// @pureRenderWithLodashDecorator
//验证name等值是否定义
@validateDecorator
//默认的一些rules，如required
@defaultRulesDecorator
//公共的context
@commonContextDecorator
/**
 * 如果覆盖了render则，用不到componentType、currentAntdComponent、getSepcialRuleByType、getDefaultRules
 */
export default class BasicComponent extends React.Component {
  //这里把所有基础表单组件的propTypes都定义了
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    rules: PropTypes.array,
    //input
    min: PropTypes.number,
    //input
    max: PropTypes.number,
    //input
    onlyLetter: PropTypes.bool,
    //password（passord继承input）
    onlyLetterAndNumber: PropTypes.bool,
    //password
    checkPassword: PropTypes.bool,
  };
  //定义组件类型
  componentType = 'text';
  //定义当前需要用到的antd表单组件
  currentAntdComponent = undefined;
  //设置特殊的async-validator rules
  getSepcialRuleByType() {
    return [];
  }
  get locale() {
    if (!this._tempLocale) {
      //context.locale是getter
      this._tempLocale = {
        ...this.context.locale,
        ...this.props.locale,
      };
    }
    return this._tempLocale;
  }
  render() {
    if (!this.context.form) {
      //如果没有使用Form.create()
      return <this.currentAntdComponent {...this.props} />;
    }
    if (!this.currentAntdComponent) {
      console.error('继承BasicComponent，必须定义currentAntdComponent');
    }
    const { FormItem } = this.context;
    let { children, name, value, rules = [], ...other } = this.props;
    const specialRules = this.getSepcialRuleByType(other.type);
    if (other.type === 'email' || other.type === 'url') {
      other.type = 'text';
    }
    if (!other.type && this.componentType) {
      //处理checkbox等
      other.type = this.componentType;
    }
    return (
      <FormItem
        {...other}
        name={name}
        initialValue={value}
        rules={[
          ...this.getDefaultRules(
            other.type,
            this.locale,
            other.label ? other.label : name
          ),
          ...specialRules,
          ...rules,
        ]}
      >
        <this.currentAntdComponent>{children}</this.currentAntdComponent>
      </FormItem>
    );
  }
}

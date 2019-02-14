//外部依赖包
import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

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
  static displayName = 'AntdFormComponent';
  //这里把所有基础表单组件的propTypes都定义了
  static propTypes = {
    name: PropTypes.string,
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
  //定义组件类型，如果组件props.type没有设置，则用组件默认设置的
  //继承此类，看情况覆盖这个属性
  componentType = 'text';
  //定义当前需要用到的antd表单组件
  currentAntdComponent = undefined;
  //当前组件的locale对象，如input的是afcInput
  localeKey = undefined;
  //设置特殊的async-validator rules
  getSepcialRuleByType() {
    return [];
  }
  get locale() {
    if (!this._tempLocale) {
      let currentComponentLocale = {};
      if (this.localeKey) {
        currentComponentLocale = {
          [this.localeKey]: this.props.locale || {},
        };
      }
      //context.locale是getter
      this._tempLocale = merge(
        this.context.locale || {},
        currentComponentLocale
      );
    }
    return this._tempLocale;
  }
  renderFormItem(item, otherProps) {
    const { FormItem } = this.context;
    //value 有歧义已废弃，使用initialValue 替换value，同时保留value用法
    let { name, initialValue, value, rules = [], ...other } = this.props;
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
        initialValue={initialValue !== undefined ? initialValue : value}
        rules={[
          ...this.getDefaultRules(
            other.type,
            this.locale,
            other.label ? other.label : name
          ),
          ...specialRules,
          ...rules,
        ]}
        {...otherProps}
      >
        {item}
      </FormItem>
    );
  }
  validateRender(component) {
    if (!this.currentAntdComponent) {
      console.error('继承BasicComponent，必须定义currentAntdComponent');
    }
    //如果没有使用Form.create()
    if (!this.context.form) {
      return component;
    }
    return this.renderFormItem(component);
  }
  render() {
    const component = (
      <this.currentAntdComponent>
        {this.props.children}
      </this.currentAntdComponent>
    );
    return this.validateRender(component);
  }
}

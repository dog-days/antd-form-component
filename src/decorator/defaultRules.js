// import React from 'react';
import { sprintf } from 'sprintf-js';
/**
 * 获取默认的rules，如required等
 * @param  {object} locale 多语言
 * @param  {string} label  使用表单组件的label，如果没定义使用name值
 * @return {array}  async-validator的某个字段rules
 */
function getDefaultRules(locale, label) {
  const { required } = this.props;
  const defaultRules = [];
  if (required) {
    defaultRules.push({
      required: true,
      message: sprintf(locale.afcCommon.isRequired, label),
    });
  }
  return defaultRules;
}
export default function(component) {
  component.prototype.getDefaultRules = getDefaultRules;
  return component;
}

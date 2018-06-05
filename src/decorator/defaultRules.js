// import React from 'react';
import { sprintf } from 'sprintf-js';
/**
 * 获取默认的rules，如required等
 * @param  {string} componentType 表单组件类型，这些使用者是不能定义的，内部定义
 * @param  {object} locale 多语言
 * @param  {string} label  使用表单组件的label，如果没定义使用name值
 * @return {array}  async-validator的某个字段rules
 */
function getDefaultRules(componentType, locale, label) {
  const { required, onlyLetter } = this.props;
  const defaultRules = [];
  if (required) {
    defaultRules.push({
      required: true,
      message: sprintf(locale.afcCommon.isRequired, label),
    });
  }
  if (componentType === 'input') {
    if (onlyLetter) {
      defaultRules.push({
        validator(rule, value, callback) {
          var errors = [];
          var pass = new RegExp('^[A-Za-z]*$').test(value);
          if (!pass) {
            errors.push({
              message: locale.afcCommon.charactersOnlyLetter,
            });
          }
          callback(errors);
        },
      });
    }
  }
  return defaultRules;
}
export default function(component) {
  component.prototype.getDefaultRules = getDefaultRules;
  return component;
}

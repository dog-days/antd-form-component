// import React from 'react';
import { sprintf } from 'sprintf-js';
import isString from 'lodash/isString';

import { strlen } from '../utils/util';
/**
 * 长度验证rules
 * @param  {number} min 最小长度
 * @param  {number} max 最大长度
 * @param  {object} locale 多语言对象
 * @return {array}  rules
 */
function getLenthRule(min, max, locale) {
  let message;
  return [
    {
      validator(rule, value, callback) {
        const errors = [];
        if (isString(value)) {
          const valueLength = strlen(value);
          let flag = true;
          if (min && max) {
            if (valueLength < min || valueLength > max) {
              flag = false;
              message = sprintf(locale.afcCommon.charactersBetwteen, min, max);
            }
          } else if (min) {
            if (valueLength < min) {
              flag = false;
              message = sprintf(locale.afcCommon.charactersMin, min);
            }
          } else if (max) {
            if (valueLength > max) {
              flag = false;
              message = sprintf(locale.afcCommon.charactersMax, max);
            }
          }
          if (!flag) {
            errors.push({
              message,
            });
          }
        }
        callback(errors);
      },
    },
  ];
}
/**
 * 获取默认的rules，如required等
 * @param  {string} componentType 表单组件类型，这些使用者是不能定义的，内部定义
 * @param  {object} locale 多语言
 * @param  {string} label  使用表单组件的label，如果没定义使用name值
 * @return {array}  async-validator的某个字段rules
 */
function getDefaultRules(componentType, locale, label) {
  const { required, min, max, onlyLetter } = this.props;
  let defaultRules = [];
  if (required) {
    defaultRules.push({
      required: true,
      message: sprintf(locale.afcCommon.isRequired, label),
    });
  }
  if (componentType === 'text') {
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
    defaultRules = defaultRules.concat(getLenthRule(min, max, locale));
  }
  return defaultRules;
}
export default function(component) {
  component.prototype.getDefaultRules = getDefaultRules;
  return component;
}

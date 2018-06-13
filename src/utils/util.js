import React from 'react';
import asyncValidator from 'async-validator';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';

/**
 * 验证单个form组件值是否合法
 * @param  {string} id 即表单组件的name值
 * @param  {string} value 需验证的表单组件值
 * @param  {array}  rules async-validator rules
 * @return {function} 验证函数
 */
export function validateField(id, value, rules = []) {
  //返回promise有问题，很奇怪，this.setState会导致中文输入不行
  return (successCallback, errorCallback) => {
    if (!rules[0]) {
      successCallback && successCallback({});
      return;
    }
    let descriptor = {};
    descriptor[id] = rules;
    let validator = new asyncValidator(descriptor);
    validator.validate({ [id]: value }, (errors, fields) => {
      if (errors) {
        errorCallback && errorCallback(errors);
      } else {
        successCallback && successCallback({});
      }
    });
  };
}
/**
 * 中英文字符长度，中文算两个长度
 * @param  {string} str 目标字符串
 * @return {number} 传入的字符串长度
 */
export function strlen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}
export function randomKey() {
  return Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('');
}

/**
 * 获取组件displayName
 * @param  {object} Comp 指定的组件
 * @return {string}      组件displayName
 */
export function getDisplayName(Comp) {
  if (!Comp) {
    return '';
  }
  if (isString('string')) {
    return Comp;
  }
  return Comp.displayName || 'Component';
}
/**
 * 根据组件displayName，递归查找React组件
 * @param  {array} children 必须是数组，jsx组件(this.props.children)
 * @param  {object} type 类型
 * @return {array} 返回匹配到的react组件，结构为
 *  {
 *    child: xxx,//当前组件
 *    index: xxx,//当前children中的位置，每个都可以能不一样
 *    children: xxx,//当前children，需要替换组件需要跟index配合。
 *  }
 */
export function findAllReactComponentsByType(children, type) {
  if (!children[0]) {
    console.error('findAllReactComponentsByType第一个参数children必须是数组');
  }
  let result = [];
  let types = [];
  if (isArray(type)) {
    types = type.map(t => getDisplayName(t));
  } else {
    types = [getDisplayName(type)];
  }
  let index = 0;
  React.Children.forEach(children, child => {
    const childType = child && child.type && child.type.displayName;
    if (types.indexOf(childType) !== -1) {
      //结构设置为这样，index和children可以配合替换当前匹配到的组件
      result.push({
        child,
        index,
        children,
      });
    } else if (children[0]) {
      if (child && child.props && child.props.children) {
        let sortChildren = React.Children.toArray(child.props.children);
        children[index] = React.cloneElement(child, child.props, sortChildren);
        let result2 = findAllReactComponentsByType(
          children[index].props.children,
          type
        );
        result2.forEach(v => {
          result.push(v);
        });
      }
    }
    index++;
  });
  return result;
}
/**
 *
 *  转换一个数组的children为object对象
 *  配合findAllReactComponentsByType使用，children是经过React.Children.toArray转换后的
 */
export function oneLengthChildrenToObject(children) {
  children.forEach((v, k) => {
    if (v && v.props && v.props.children) {
      if (v.props.children.length === 1) {
        children[k] = React.cloneElement(v, v.props, v.props.children[0]);
        if (v.props.children.props && v.props.children.props.children) {
          oneLengthChildrenToObject(v.props.children.props.children);
        }
      }
    }
  });
}

/**
 * 交换数组指定的的两个键值位置,repalceIndex > index 下移，相反上移
 * @param {Array} arr 需要处理的数组
 * @param {index0} index 目标索引位置
 * @param {index1} repalceIndex 替换索引位置
 * @return {Array} 返回处理的数组
 */
export function swapArrayItem(arr, index, repalceIndex) {
  arr[repalceIndex] = arr.splice(index, 1, arr[repalceIndex])[0];
  return arr;
}
/**
 * toUpperCase 小写转大写
 * @param  {string} string 传进来的字符串
 * @param  {int}  start  开始位置，默认0
 * @param  {Int}  end  介绍位置，默认1
 * @return {string}
 */
export function toUpperCaseByPosition(string, start = 0, end = 1) {
  var str1 = string.substr(start, end).toUpperCase();
  var str2 = string.substr(end);
  return str1 + str2;
}

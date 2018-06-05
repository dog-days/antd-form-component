import asyncValidator from 'async-validator';

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
  var len = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

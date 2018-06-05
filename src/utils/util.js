import asyncValidator from 'async-validator';

/**
 * 验证单个form组件值是否合法
 * @param  {string} id 即表单组件的name值
 * @param  {string} value 需验证的表单组件值
 * @param  {array}  rules async-validate rules
 * @return {promise}  返回promise对象
 */
export function validateField(id, value, rules = []) {
  return new Promise((resovle, reject) => {
    if (!rules[0]) {
      resovle({});
      return;
    }
    let descriptor = {};
    descriptor[id] = rules;
    let validator = new asyncValidator(descriptor);
    validator.validate({ [id]: value }, (errors, fields) => {
      if (errors) {
        reject(errors);
      } else {
        resovle();
      }
    });
  });
}

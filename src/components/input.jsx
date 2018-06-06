//外部依赖包
import React from 'react';
// import PropTypes from 'prop-types';
import AInput from 'antd/lib/input';
// import PropTypes from 'prop-types';

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
  getSepcialRuleByType(type) {
    const rules = [];
    const locale = this.locale;
    switch (type) {
      case 'email':
        rules.push({
          type: 'email',
          message: locale.afcInput.emailFormat,
        });
        break;
      case 'url':
        rules.push({
          type: 'url',
          message: locale.afcInput.urlFormat,
        });
        break;
      default:
    }
    return rules;
  }
  render() {
    if (!this.context.form) {
      //如果没有使用Form.create()
      return <AInput {...this.props} />;
    }
    const { getFieldDecorator } = this.context.form;
    let { name, value, rules = [], ...other } = this.props;
    const specialRules = this.getSepcialRuleByType(other.type);
    if (other.type === 'email' || other.type === 'url') {
      delete other.type;
    }
    return getFieldDecorator(name, {
      initialValue: value,
      rules: [
        ...this.getDefaultRules(
          'input',
          this.locale,
          other.label ? other.label : name
        ),
        ...specialRules,
        ...rules,
      ],
    })(<AInput {...other} />);
  }
}

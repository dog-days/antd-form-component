//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import AInput from 'antd/lib/input';
//内部依赖包
import BasicComponent from '../basic-component';

export default class Input extends BasicComponent {
  currentAntdComponent = AInput;
  getSepcialRuleByType(type) {
    //继承父类可能有的rules
    const rules = super.getSepcialRuleByType();
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
}
Input.TextArea = class InputTextArea extends BasicComponent {
  currentAntdComponent = AInput.TextArea;
};
Input.Search = class InputSearch extends BasicComponent {
  currentAntdComponent = AInput.Search;
};
Input.Group = AInput.Group;

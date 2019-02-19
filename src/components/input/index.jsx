//外部依赖包
import React from 'react';
import PropTypes from 'prop-types';
import AInput from 'antd/lib/input';
import AForm from 'antd/lib/form';
//内部依赖包
import BasicComponent from '../basic-component';

AInput.displayName = 'OriginalAntdComponent';

export default class Input extends BasicComponent {
  currentAntdComponent = AInput;
  localeKey = 'afcInput';

  getOnlyLetterAndNumberRule() {
    const locale = this.locale;
    return [
      {
        validator(rule, value, callback, source, options) {
          var errors = [];
          //数组和字母结合
          var pass = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$').test(
            value
          );
          if (!pass && value !== '') {
            errors.push({
              message: locale.afcInput.formatErrorMsg,
            });
          }
          callback(errors);
        },
      },
    ];
  }

  getIpRule() {
    const locale = this.locale;
    return {
      validator: (rule, value, callback, source, options) => {
        const reg = /^([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])\.([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])$/;
        const errors = [];
        if (!reg.test(value) && value) {
          errors.push(locale.afcInput.ipFormat);
        }
        callback(errors);
      },
    };
  }

  getSepcialRuleByType(type) {
    //继承父类可能有的rules
    const rules = super.getSepcialRuleByType();
    const locale = this.locale;
    const { onlyLetterAndNumber } = this.props;
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
      case 'ip':
        rules.push(this.getIpRule());
        break;
      default:
    }
    if (onlyLetterAndNumber) {
      return [...rules, ...this.getOnlyLetterAndNumberRule()];
    } else {
      return rules;
    }
  }
}
Input.TextArea = class InputTextArea extends BasicComponent {
  currentAntdComponent = AInput.TextArea;
};
Input.Search = class InputSearch extends BasicComponent {
  currentAntdComponent = AInput.Search;
};
Input.Group = class InputGroup extends React.Component {
  static contextTypes = {
    formItemProps: PropTypes.object,
    form: PropTypes.object,
    on: PropTypes.func,
    hasFeedback: PropTypes.bool,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
  };
  static childContextTypes = {
    isGroup: PropTypes.bool,
  };
  getChildContext() {
    return {
      isGroup: true,
    };
  }
  state = {};
  //验证是否是AntdFormComponent组件
  //所有AntdFormComponent都打上了标记
  getChildrenNames() {
    let { children } = this.props;
    if (!children) {
      return;
    }
    if (children && !children[0]) {
      children = [children];
    }
    const names = [];
    children.forEach((v, k) => {
      if (v.type.displayName !== 'AntdFormComponent') {
        console.error(
          `InputGroup的第${k + 1}个子组件不是antd-form-component组件!`
        );
      }
      if (v.props.name) {
        names.push(v.props.name);
      }
    });
    return names;
  }
  componentWillMount() {
    const names = this.getChildrenNames();
    this.context.on &&
      this.context.on('form-errors', ({ name, fieldError }) => {
        if (!!~names.indexOf(name)) {
          //只处理input-group里表单组件的错误
          this.setState({
            fieldsError: {
              ...this.state.fieldsError,
              [name]: fieldError,
            },
          });
        }
      });
  }
  getErrorMessage() {
    const { fieldsError } = this.state;
    if (!fieldsError) {
      return;
    }
    const messageArray = [];
    let message = '';
    for (let k in fieldsError) {
      if (fieldsError[k]) {
        //eslint-disable-next-line
        fieldsError[k].forEach(v => {
          messageArray.push(v.message);
        });
      }
    }
    messageArray.forEach((m, k) => {
      if (k !== 0) {
        message += ',' + m;
      } else {
        message += m;
      }
    });
    return message;
  }
  getValidateStatus(errorMessage) {
    if (errorMessage) {
      return errorMessage ? 'error' : 'success';
    }
  }
  render() {
    const { label, noFormItem, ...other } = this.props;
    const errorMessage = this.getErrorMessage();
    const context = this.context;
    if (noFormItem) {
      return <AInput.Group {...other} />;
    } else {
      return (
        <AForm.Item
          className="afc-input-group"
          hasFeedback={context.hasFeedback}
          wrapperCol={context.wrapperCol}
          labelCol={context.labelCol}
          {...context.formItemProps}
          label={label}
          help={errorMessage}
          validateStatus={this.getValidateStatus(errorMessage)}
        >
          <AInput.Group {...other} />
        </AForm.Item>
      );
    }
  }
};

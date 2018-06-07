//外部依赖包
import React from 'react';
// import PropTypes from 'prop-types';
//内部依赖包
import BasicComponent from '../basic-component';
import Input from '../input';

export default class Password extends BasicComponent {
  state = { passwordValue: '' };
  getChekckPasswordRule() {
    const locale = this.locale;
    const rules = [
      {
        validator: (rule, value, callback) => {
          const passwordValue = this.state.passwordValue;
          var errors = [];
          if (passwordValue !== value) {
            errors.push({
              message: locale.afcPassword.checkErrorMsg,
            });
          }
          callback(errors);
        },
      },
    ];
    return rules;
  }
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
              message: locale.afcPassword.formatErrorMsg,
            });
          }
          callback(errors);
        },
      },
    ];
  }
  onPasswordChange = e => {
    const { onChange } = this.props;
    this.setState({
      passwordValue: e.target.value,
    });
    onChange && onChange(e);
  };

  render() {
    const { rePassword, checkPassword, rules = [], ...other } = this.props;
    const locale = this.locale;
    return (
      <span>
        <Input
          {...other}
          onChange={this.onPasswordChange}
          rules={[...rules, ...this.getOnlyLetterAndNumberRule()]}
        />
        {(rePassword || checkPassword) && (
          //rePassword视为了兼容之前的formBuilder的api
          <Input
            {...other}
            label={locale.afcPassword.checkLabel}
            name={`check-${other.name}`}
            //不需要required
            required={false}
            rules={this.getChekckPasswordRule()}
          />
        )}
      </span>
    );
  }
}

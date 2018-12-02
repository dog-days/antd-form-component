//外部依赖包
import React from 'react';
// import PropTypes from 'prop-types';
//内部依赖包
import BasicComponent from '../basic-component';
import Input from '../input';

export default class Password extends BasicComponent {
  localeKey = 'afcPassword';
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
  onPasswordChange = e => {
    const { onChange } = this.props;
    this.setState({
      passwordValue: e.target.value,
    });
    onChange && onChange(e);
  };

  render() {
    const {
      rePassword,
      type = 'password',
      checkPassword,
      onlyLetterAndNumber = true,
      ...other
    } = this.props;
    const locale = this.locale;
    return (
      <span>
        <Input
          autoComplete="new-password"
          type={type}
          onlyLetterAndNumber={onlyLetterAndNumber}
          {...other}
          onChange={this.onPasswordChange}
        />
        {(rePassword || checkPassword) && (
          //rePassword视为了兼容之前的formBuilder的api
          <Input
            autoComplete="new-password"
            type={type}
            {...other}
            label={locale.afcPassword.checkLabel}
            name={`check-${other.name}`}
            rules={this.getChekckPasswordRule()}
          />
        )}
      </span>
    );
  }
}

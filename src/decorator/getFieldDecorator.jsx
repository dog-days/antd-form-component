import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import isNumber from 'lodash/isNumber';

import { validateField } from '../utils/util';

export default function(name, options) {
  //转换成字符串
  if (isNumber(options.initialValue)) {
    options.initialValue += '';
  }
  const that = this;
  return FormItemComponent => {
    //当FormItemComponent.props.noFormItem为true时，不渲染antd的Form.Item
    //也不进行合法校验
    class FormItem extends React.Component {
      state = {
        value: options.initialValue,
        //有初始值则需要验证是否合法才给渲染，否则不用。
        canBeRendered: options.initialValue ? false : true,
      };
      static contextTypes = {
        size: PropTypes.string,
        hasFeedback: PropTypes.bool,
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        formItemProps: PropTypes.object,
      };
      componentDidMount() {
        if (options.initialValue) {
          this.validateField(name, options.initialValue, options.rules);
        }
        if (!FormItemComponent.props.noFormItem) {
          that.fieldsValidate[name] = () => {
            const { value } = this.state;
            return this.validateField(name, value, options.rules);
          };
        }
        that.on('form-set-field-value-' + name, value => {
          this.validateField(name, value, options.rules);
        });
        that.on('form-reset-field-value', names => {
          const resetValue = () => {
            this.setState({
              value: options.initialValue,
              errors: undefined,
            });
            that.trigger('form-values', {
              name,
              fieldValue: options.initialValue,
            });
            that.trigger('form-errors', {
              name,
            });
          };
          if (names && names[0]) {
            if (!!~names.indexOf(name)) {
              //names存在值一致的${name}则重置
              resetValue();
            }
          } else if (!name) {
            resetValue();
          }
        });
      }
      validateField(name, value, rules) {
        return new Promise(resolve => {
          validateField(name, value, rules)(
            () => {
              this.setState({
                value,
                errors: undefined,
                canBeRendered: true,
              });
              that.trigger('form-values', {
                name,
                fieldValue: value,
              });
              that.trigger('form-errors', {
                name,
              });
              resolve();
            },
            errors => {
              this.setState({
                value,
                errors,
                canBeRendered: true,
              });
              that.trigger('form-values', {
                name,
              });
              that.trigger('form-errors', {
                name,
                fieldError: errors,
              });
              resolve(errors);
            }
          );
        });
      }
      onChange = e => {
        const { onChange } = this.props;
        let value;
        if (!e) {
          value = undefined;
        } else if (e.target) {
          value = e.target.value;
        } else {
          value = e;
        }
        if (FormItemComponent.props.type === 'file') {
          //特殊处理type=file的情况
          value = e.target.files[0];
        }
        if (FormItemComponent.props.type === 'checkbox') {
          //特殊处理type=file的情况
          if (e.target.checked) {
            value = e.target.checked;
          } else {
            value = '';
          }
        }
        onChange && onChange(e);
        if (!FormItemComponent.props.noFormItem) {
          this.validateField(name, value, options.rules);
        } else {
          this.setState({ value });
        }
      };
      getErrorMessage() {
        if (!FormItemComponent.props.noFormItem) {
          const { errors } = this.state;
          let message = '';
          errors &&
            errors.forEach((v, k) => {
              if (k !== 0) {
                message += ',' + v.message;
              } else {
                message += v.message;
              }
            });
          return message;
        }
      }
      getValidateStatus() {
        if (!FormItemComponent.props.noFormItem) {
          const { errors, value } = this.state;
          if (errors) {
            return 'error';
          } else if (value) {
            return 'success';
          }
        }
      }
      renderItem(otherItemProps) {
        const context = this.context;
        return React.createElement(
          //这里面不使用React.cloneElement
          //是为了移除一些没用的props，如noRormItem
          FormItemComponent.type,
          {
            size: context.size,
            ...otherItemProps,
            onChange: this.onChange,
          },
          otherItemProps.children
        );
      }
      deleteUnuseProps(otherItemProps) {
        delete otherItemProps.onlyLetter;
        delete otherItemProps.min;
        delete otherItemProps.max;
      }
      render() {
        if (!this.state.canBeRendered) {
          return false;
        }
        const help = this.getErrorMessage();
        const validateStatus = this.getValidateStatus();
        const context = this.context;
        const {
          required,
          label,
          noFormItem,
          ...otherItemProps
        } = FormItemComponent.props;
        this.deleteUnuseProps(otherItemProps);
        if (otherItemProps.type !== 'file') {
          //input type=file是不受控表单
          otherItemProps.value = this.state.value;
        }
        let hasFeedback = context.hasFeedback;
        if (
          otherItemProps.type === 'checkbox' ||
          otherItemProps.type === 'checkbox-group'
        ) {
          //checkbox不需要feedback提示，影响布局美观
          hasFeedback = false;
        }
        if (noFormItem || otherItemProps.type === 'hidden') {
          return this.renderItem(otherItemProps);
        } else {
          return (
            <Form.Item
              hasFeedback={hasFeedback}
              wrapperCol={context.wrapperCol}
              labelCol={context.labelCol}
              {...context.formItemProps}
              help={help}
              validateStatus={validateStatus}
              label={label}
              required={required}
            >
              {this.renderItem(otherItemProps)}
            </Form.Item>
          );
        }
      }
    }
    return <FormItem />;
  };
}

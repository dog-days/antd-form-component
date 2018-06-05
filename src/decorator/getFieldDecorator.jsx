import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

import { validateField } from '../utils/util';

export default function(name, options) {
  //转换成字符串
  if (options.initialValue) {
    options.initialValue += '';
  }
  const that = this;
  return FormItemComponent => {
    //当FormItemComponent.props.noFormItem为true时，不渲染antd的Form.Item
    //也不进行合法校验
    class FormItem extends React.Component {
      state = { value: options.initialValue };
      static contextTypes = {
        size: PropTypes.string,
        hasFeedback: PropTypes.bool,
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object,
        formItemProps: PropTypes.object,
      };
      componentDidMount() {
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
        return validateField(name, value, rules).then(
          () => {
            this.setState({
              value,
              errors: undefined,
            });
            that.trigger('form-values', {
              name,
              fieldValue: value,
            });
            that.trigger('form-errors', {
              name,
            });
          },
          errors => {
            this.setState({
              value,
              errors,
            });
            that.trigger('form-values', {
              name,
            });
            that.trigger('form-errors', {
              name,
              fieldError: errors,
            });
            return errors;
          }
        );
      }
      onChange = e => {
        const { onChange } = this.props;
        let value = e.target ? e.target.value : e;
        if (FormItemComponent.props.type === 'file') {
          //特殊处理type=file的情况
          value = e.target.files[0];
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
      render() {
        const help = this.getErrorMessage();
        const validateStatus = this.getValidateStatus();
        const context = this.context;
        const {
          required,
          label,
          noFormItem,
          ...otherItemProps
        } = FormItemComponent.props;
        if (otherItemProps.type !== 'file') {
          //input type=file是不受控表单
          otherItemProps.value = this.state.value;
        }
        if (noFormItem) {
          return this.renderItem(otherItemProps);
        } else {
          return (
            <Form.Item
              hasFeedback={context.hasFeedback}
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
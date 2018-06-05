//外部依赖包
import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import AForm from 'antd/lib/form';
//内部依赖包
import event from '../utils/event';
import getFieldDecorator from '../decorator/getFieldDecorator';
import defaultLoacale from '../locale-provider/zh_CN';

class Form extends React.Component {
  static create() {
    class Decorator extends React.Component {
      static childContextTypes = {
        form: PropTypes.object,
      };

      getChildContext() {
        return {
          form: this.form,
        };
      }
      form = {
        getFieldDecorator: (name, options = {}) => {
          if (options.initialValue) {
            //初始化默认值
            this.fieldsValue[name] = options.initialValue + '';
          }
          return getFieldDecorator.bind(this)(name, options);
        },
        /**
         * 获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error
         * @param  {array} names name数组
         * @return {object} 返回指定fieldsError或者全部fieldsError
         */
        getFieldsError: names => {
          if (!names) {
            return this.fieldsError;
          } else if (names[0]) {
            const fieldsError = {};
            name.forEach(v => {
              if (this.fieldsError[v] !== undefined) {
                fieldsError[v] = this.fieldsError[v];
              }
            });
          }
        },
        /**
         * 获取某个输入表单控件的 Error
         * @param  {string} name 表单空间name值
         * @return {object} 返回指定fieldsError
         */
        getFieldError: name => {
          return this.fieldsError[name];
        },
        /**
         * 获取一组输入控件的值，如不传入参数，则获取全部组件的值
         * @param  {array} names name数组
         * @return {object} 返回指定fieldsValue或者全部fieldsValue
         */
        getFieldsValue: names => {
          if (!names) {
            return this.fieldsValue;
          } else if (names[0]) {
            const fieldsValue = {};
            name.forEach(v => {
              if (this.fieldsValue[v] !== undefined) {
                fieldsValue[v] = this.fieldsValue[v];
              }
            });
          }
        },
        /**
         * 获取某个输入表单控件的值
         * @param  {string} name 表单空间name值
         * @return {object} 返回指定fieldValue
         */
        getFieldValue: name => {
          return this.fieldsValue[name];
        },
        /**
         * 重置一组输入控件的值（为 initialValue）与状态，如不传入参数，则重置所有组件
         * @param {array} 表单names，即各个表单组件的name数组
         */
        resetFields: names => {
          this.trigger('form-reset-field-value', names);
        },
        /**
         * 设置一组输入控件的值
         * @param {object} fieldsValue 格式为{fieldName1: value1,fieldName2: value2}
         */
        setFieldsValue: fieldsValue => {
          for (let k in fieldsValue) {
            this.trigger('form-set-field-value-' + k, fieldsValue[k]);
          }
        },
        /**
         * 校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件
         * @param {array} 表单names，即各个表单组件的name数组，如果传入函数则变成callback参数
         * @param {function} callback function(err,fieldsValue){}
         */
        validateFields: (names, callback) => {
          let fieldsValidate = {};
          if (isFunction(names)) {
            //如果name是函数则变成callback
            callback = names;
            fieldsValidate = this.fieldsValidate;
          } else if (names && names[0]) {
            names.forEach(v => {
              fieldsValidate[v] = this.fieldsValue[v];
            });
          } else {
            fieldsValidate = this.fieldsValidate;
          }
          const fieldsValidateArray = [];
          for (let k in fieldsValidate) {
            fieldsValidateArray.push(fieldsValidate[k]());
          }
          Promise.all(fieldsValidateArray)
            .then(errors => {
              let fieldsError;
              errors.forEach(v => {
                if (v && v[0] && v[0].field) {
                  if (!fieldsError) {
                    fieldsError = {};
                  }
                  fieldsError[v[0].field] = v;
                }
              });
              return fieldsError;
            })
            .then(errors => {
              callback &&
                callback(errors, !!errors ? undefined : this.fieldsValue);
            });
        },
      };
      //存放各个filed的验证方法
      fieldsValidate = {};
      fieldsValue = {};
      fieldsError = {};
      componentDidMount() {
        this.on('form-values', ({ name, fieldValue }) => {
          if (fieldValue) {
            this.fieldsValue[name] = fieldValue;
          } else {
            delete this.fieldsValue[name];
          }
        });
        this.on('form-errors', ({ name, fieldError }) => {
          if (fieldError) {
            this.fieldsError[name] = fieldError;
          } else {
            delete this.fieldsError[name];
          }
        });
      }
      componentWillUnmount() {
        this.off();
      }
      render() {
        let WrapperComponent = this.getWrapperComponent();
        return <WrapperComponent {...this.props} form={this.form} />;
      }
    }
    //整合backbone全局事件处理方式
    Object.assign(Decorator.prototype, event);
    return WrappedComponent => {
      function getDisplayName(WrappedComponent) {
        return (
          WrappedComponent.displayName ||
          WrappedComponent.name ||
          'WrappedComponent'
        );
      }
      Decorator.displayName = `Form(${getDisplayName(WrappedComponent)})`;
      Decorator.prototype.getWrapperComponent = () => WrappedComponent;
      return Decorator;
    };
  }
  static propTypes = {
    size: PropTypes.string,
    hasFeedback: PropTypes.bool,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
    locale: PropTypes.object,
  };
  static contextTypes = {
    antLocale: PropTypes.object,
  };
  static childContextTypes = {
    size: PropTypes.string,
    hasFeedback: PropTypes.bool,
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object,
    locale: PropTypes.object,
  };
  getChildContext() {
    return {
      size: this.props.size,
      hasFeedback: this.props.hasFeedback,
      labelCol: this.props.labelCol,
      wrapperCol: this.props.wrapperCol,
      locale: this.locale,
    };
  }
  get locale() {
    return {
      ...defaultLoacale,
      ...this.context.antLocale,
      ...this.props.locale,
    };
  }
  render() {
    const { ...other } = this.props;
    //为了防止传递给原生form，react会报错。
    delete other.locale;
    delete other.hasFeedback;
    delete other.labelCol;
    delete other.wrapperCol;
    delete other.size;
    return <AForm {...other}>{this.props.children}</AForm>;
  }
}
Form.Item = class FormItem extends React.Component {
  //Form.Item只是为了传递props到antd的Form.Item
  //如果没用到，可以不使用。
  static childContextTypes = {
    formItemProps: PropTypes.object,
  };
  getChildContext() {
    return {
      formItemProps: this.props,
    };
  }
  render() {
    return this.props.children;
  }
};
export default Form;

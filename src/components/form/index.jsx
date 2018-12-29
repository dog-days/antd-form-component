//外部依赖包
import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import AForm from 'antd/lib/form';
import merge from 'lodash/merge';
//内部依赖包
import event from '../../utils/event';
import { validateField, findAllReactComponentsByType } from '../../utils/util';
import defaultLoacale from '../../locale-provider/zh_CN';
import BasicComponent from '../basic-component';

class Form extends React.Component {
  static create() {
    class Decorator extends React.Component {
      static childContextTypes = {
        form: PropTypes.object,
        FormItem: PropTypes.func,
        on: PropTypes.func,
        //由于form的trigger覆盖了，所以使用了triggerEvent
        triggerEvent: PropTypes.func,
      };
      formItem = getFormItemComponent(this);
      getChildContext() {
        return {
          form: this.form,
          //通过context传递给子组件使用，目前basic-component在使用
          //表单验证都是在这里处理的
          FormItem: this.formItem,
          on: this.on.bind(this),
          //由于form的trigger覆盖了，所以使用了triggerEvent
          triggerEvent: this.trigger.bind(this),
        };
      }
      form = {
        //存放temp
        customComponent: {},
        getFieldDecorator(name, props) {
          return component => {
            function newComponent(props) {
              return React.cloneElement(component, props);
            }
            if (!this.customComponent[name]) {
              //不可以重新定义，要不组件在state改变的情况下也会unmount
              this.customComponent[
                name
              ] = class Component extends BasicComponent {
                currentAntdComponent = newComponent;
              };
            }
            const AntdFormComponent = this.customComponent[name];
            return (
              <AntdFormComponent
                {...props}
                name={name}
                value={props.initialValue}
              />
            );
          };
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
            return {
              ...this.fieldsValue,
            };
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
              fieldsValidate[v] = this.fieldsValidate[v];
            });
          } else {
            fieldsValidate = this.fieldsValidate;
          }
          const fieldsValidateArray = [];
          for (let k in fieldsValidate) {
            if (fieldsValidate[k]) {
              fieldsValidateArray.push(fieldsValidate[k]());
            } else {
              console.warn(`表单控件${k} 验证不存在`);
            }
          }
          Promise.all(fieldsValidateArray)
            .then(errors => {
              let fieldsError;
              errors.forEach((v, isArrayInput) => {
                if (v && v[0] && v[0].field) {
                  if (!fieldsError) {
                    fieldsError = {};
                  }
                  if (isArrayInput) {
                    const arrayItemName = v[0].field.split('_-_')[0];
                    if (!fieldsError[arrayItemName]) {
                      fieldsError[arrayItemName] = [];
                    }
                    fieldsError[arrayItemName].push(v);
                  } else {
                    fieldsError[v[0].field] = v;
                  }
                }
              });
              return fieldsError;
            })
            .then(errors => {
              callback &&
                callback(
                  errors,
                  !!errors ? undefined : { ...this.fieldsValue }
                );
            });
        },
      };
      //存放各个filed的验证方法
      fieldsValidate = {};
      fieldsValue = {};
      //临时存放fieldsValue
      tempFieldsValue = {};
      fieldsError = {};
      //临时存放fieldsError
      tempFieldsError = {};
      //v17.0版本后会移除componentWillMount
      componentWillMount() {
        this.on(
          'form-values',
          ({ name, fieldValue, isArrayInput, arrayItemIndexs }) => {
            if (!isArrayInput) {
              this.fieldsValue[name] = fieldValue;
            } else {
              //专门处理array-input value值
              this.tempFieldsValue[name] = fieldValue;
              const arrayItemName = name.split('_-_')[0];
              this.setFieldByType(
                'fieldsValue',
                arrayItemName,
                arrayItemIndexs
              );
            }
          }
        );
        this.on(
          'form-errors',
          ({ name, fieldError, isArrayInput, arrayItemIndexs }) => {
            if (!isArrayInput) {
              if (fieldError) {
                this.fieldsError[name] = fieldError;
              } else {
                delete this.fieldsError[name];
              }
            } else {
              //专门处理array-input error值
              if (fieldError) {
                this.tempFieldsError[name] = fieldError;
              } else {
                delete this.tempFieldsError[name];
              }
              const arrayItemName = name.split('_-_')[0];
              this.setFieldByType(
                'fieldsError',
                arrayItemName,
                arrayItemIndexs
              );
            }
          }
        );

        this.on('array-item-index-change', ({ name, arrayItemIndexs }) => {
          this.setFieldByType('fieldsValue', name, arrayItemIndexs);
          this.setFieldByType('fieldsError', name, arrayItemIndexs);
        });
      }
      /**
       * 专门处理 array-input fieldsError fieldsValue的
       * @param {String} fieldType
       * @param {String} name
       * @param {Number} arrayItemIndexs
       */
      setFieldByType(fieldType, name, arrayItemIndexs) {
        const arrayItemName = name;
        this[fieldType][arrayItemName] = [];
        arrayItemIndexs.forEach((v, k) => {
          if (fieldType === 'fieldsError') {
            const fieldError = this.tempFieldsError[`${arrayItemName}_-_${v}`];
            if (fieldError) {
              this[fieldType][arrayItemName][k] = fieldError;
            }
          }
          if (fieldType === 'fieldsValue') {
            this[fieldType][arrayItemName][k] = this.tempFieldsValue[
              `${arrayItemName}_-_${v}`
            ];
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
    trigger: PropTypes.string,
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
    trigger: PropTypes.string,
    locale: PropTypes.object,
    //是否使用了Form
    useForm: PropTypes.bool,
  };
  getChildContext() {
    return {
      size: this.props.size,
      hasFeedback: this.props.hasFeedback,
      labelCol: this.props.labelCol,
      wrapperCol: this.props.wrapperCol,
      locale: this.locale,
      trigger: this.props.trigger,
      useForm: true,
    };
  }
  get locale() {
    return merge(defaultLoacale, this.context.antLocale, this.props.locale);
  }
  render() {
    const { ...other } = this.props;
    //为了防止传递给原生form，react会报错。
    delete other.locale;
    delete other.hasFeedback;
    delete other.labelCol;
    delete other.wrapperCol;
    delete other.size;
    delete other.trigger;
    return <AForm {...other}>{this.props.children}</AForm>;
  }
}
function getFormItemComponent(that) {
  return class extends React.Component {
    state = {
      value: this.props.initialValue,
      //有初始值则需要验证是否合法才给渲染，否则不用。
      canBeRendered: this.props.initialValue ? false : true,
    };
    static contextTypes = {
      size: PropTypes.string,
      hasFeedback: PropTypes.bool,
      labelCol: PropTypes.object,
      wrapperCol: PropTypes.object,
      formItemProps: PropTypes.object,
      trigger: PropTypes.string,
      //是否是group组件，如InputGroup，目前只有这个InputGroup传递了这个参数
      isGroup: PropTypes.bool,
      //是否是多层jsx包裹
      isAntdComponentDeep: PropTypes.bool,
      //是否是arrayInput
      isArrayInput: PropTypes.bool,
    };
    name = this.props.name;
    componentWillUnmount() {
      const name = this.name;
      that.off('form-set-field-value-' + name);
      //删除unmount组件的validate
      delete that.fieldsValidate[name];
      this.triggerFormValue(name);
      this.triggerFormError(name);
    }
    componentDidMount() {
      const name = this.name;
      const { initialValue, rules, type } = this.props;
      this.formComponentType = type;
      if (initialValue !== undefined) {
        //设置初始化默认值
        // that.fieldsValue[name] = initialValue;
        //验证默认值是否合法
        this.validateField(name, initialValue, rules);
      }
      if (!this.props.noFormItem) {
        that.fieldsValidate[name] = () => {
          const { value } = this.state;
          return this.validateField(this.name, value, rules);
        };
      }
      that.on('form-set-field-value-' + name, value => {
        this.validateField(this.name, value, rules);
      });
      that.on('form-reset-field-value', names => {
        const resetValue = () => {
          if (initialValue) {
            this.validateField(name, initialValue, rules);
          } else {
            this.setState({
              value: initialValue,
              errors: undefined,
              validateStatus: undefined,
            });
          }
          this.triggerFormValue(name, initialValue);
          this.triggerFormError(name);
        };
        if (names && names[0]) {
          if (!!~names.indexOf(name)) {
            //names存在值一致的${name}则重置
            resetValue();
          }
        } else if (!names) {
          resetValue();
        }
      });
    }
    triggerFormValue(name, value) {
      that.trigger('form-values', {
        formComponentType: this.formComponentType,
        name,
        fieldValue: value,
        isArrayInput: this.context.isArrayInput,
        arrayItemIndexs: this.props.arrayItemIndexs,
      });
    }
    triggerFormError(name, error) {
      that.trigger('form-errors', {
        name,
        fieldError: error,
        isArrayInput: this.context.isArrayInput,
        arrayItemIndexs: this.props.arrayItemIndexs,
      });
    }
    validateField(name, value, rules) {
      return new Promise(resolve => {
        validateField(name, value, rules)(
          () => {
            this.setState({
              value,
              errors: undefined,
              validateStatus: 'success',
              canBeRendered: true,
            });
            this.triggerFormValue(name, value);
            this.triggerFormError(name);
            resolve();
          },
          errors => {
            this.setState({
              value,
              errors,
              validateStatus: 'error',
              canBeRendered: true,
            });
            this.triggerFormValue(name);
            this.triggerFormError(name, errors);
            resolve(errors, this.context.isArrayInput);
          }
        );
      });
    }
    onChangeOrBlurEvent = (e, shouldValidate) => {
      const { noFormItem, type, required, min } = this.props;
      let value;
      if (e === undefined) {
        value = undefined;
      } else if (e.target) {
        value = e.target.value;
      } else {
        value = e;
      }
      if (type === 'file') {
        //特殊处理type=file的情况
        value = e.target.files[0];
      }
      if (type === 'checkbox') {
        //特殊处理type=file的情况
        if (e.target.checked) {
          value = e.target.checked;
        } else {
          value = '';
        }
      }
      if (type === 'input-number') {
        if ((value === '' || value === undefined) && required) {
          value = min || 0;
        }
      }
      if (!noFormItem && shouldValidate) {
        this.validateField(this.name, value, this.props.rules);
      } else {
        this.setState({ value });
      }
    };
    trigger = this.props.trigger || this.context.trigger || 'onChange';
    onBlur = e => {
      const trigger = this.trigger;
      if (trigger === 'onBlur') {
        this.onChangeOrBlurEvent(e, trigger === 'onBlur');
      }
      const { onBlur } = this.props;
      onBlur && onBlur(e);
    };
    onChange = e => {
      const trigger = this.trigger;
      this.onChangeOrBlurEvent(e, trigger === 'onChange');
      const { onChange } = this.props;
      onChange && onChange(e);
    };
    getErrorMessage() {
      if (!this.props.noFormItem) {
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
    //渲染表单组件
    renderItem(otherItemProps) {
      const context = this.context;
      this.deleteUnuseProps(otherItemProps);
      if (context.isAntdComponentDeep) {
        //这里目前只有array-input使用到
        return this.renderDeepItem(otherItemProps);
      } else {
        const { children, ...other } = otherItemProps;
        return React.cloneElement(children, {
          size: context.size,
          ...other,
          onChange: this.onChange,
          onBlur: this.onBlur,
          id: 'afc-form-item-' + this.name,
        });
      }
    }
    //渲染表单组件(children不是antd表单组件，在children.prop.chidren或者更深层)
    renderDeepItem(otherItemProps) {
      const context = this.context;
      let { children, ...other } = otherItemProps;
      if (!children) {
        return false;
      }
      if (!children[0]) {
        //findAllReactComponentsByType，需要的数组，需要转换
        //后续需要转换回来。
        children = [children];
      }
      //这里会复杂一点，因为children不一定是antd表单组件，只是包含在更深层
      //所以需要找出来，然后把props传递过去（需要替换）。
      const targetItem = findAllReactComponentsByType(
        children,
        'OriginalAntdComponent'
      );
      if (targetItem.length > 1) {
        console.error('原生的Form.Item只能包含一个原生的antd组件');
      }
      targetItem.forEach(target => {
        const clone = React.cloneElement(target.child, {
          size: context.size,
          ...other,
          onChange: this.onChange,
          onBlur: this.onBlur,
          id: 'afc-form-item-' + this.name,
        });
        //替换成最终的组件
        target.children[target.index] = clone;
      });
      //上面转换成数组后需要转换原来非数组children，否则会报key值不存在
      return children[0];
    }
    deleteUnuseProps(otherItemProps) {
      if (otherItemProps.type !== 'input-number') {
        delete otherItemProps.min;
        delete otherItemProps.max;
      }
      delete otherItemProps.onlyLetter;
      delete otherItemProps.initialValue;
      delete otherItemProps.rules;
      delete otherItemProps.trigger;
      delete otherItemProps.aliasLabel;
      delete otherItemProps.arrayItemIndexs;
      delete otherItemProps.onlyLetterAndNumber;
      delete otherItemProps.onlyChinese;
    }
    render() {
      const { validateStatus, canBeRendered } = this.state;
      if (!canBeRendered) {
        return false;
      }
      const errorMessage = this.getErrorMessage();
      const context = this.context;
      const { required, label, noFormItem, ...otherItemProps } = this.props;
      if (otherItemProps.type !== 'file') {
        //input type=file是不受控表单
        otherItemProps.value = this.state.value;
      }
      let hasFeedback = context.hasFeedback;
      if (this.trigger === 'onBlur') {
        //onBlur时，feedback用户体验不好，直接禁止
        hasFeedback = false;
      } else if (
        otherItemProps.type === 'radio-group' ||
        otherItemProps.type === 'checkbox' ||
        otherItemProps.type === 'checkbox-group'
      ) {
        //checkbox不需要feedback提示，影响布局美观
        hasFeedback = false;
      }
      if (noFormItem || otherItemProps.type === 'hidden' || context.isGroup) {
        return this.renderItem(otherItemProps);
      } else {
        return (
          <AForm.Item
            hasFeedback={hasFeedback}
            wrapperCol={context.wrapperCol}
            labelCol={context.labelCol}
            {...context.formItemProps}
            help={errorMessage}
            validateStatus={validateStatus}
            label={label}
            required={required}
          >
            {this.renderItem(otherItemProps)}
          </AForm.Item>
        );
      }
    }
  };
}
Form.Item = class FormItem extends React.Component {
  //Form.Item只是为了传递props到antd的Form.Item
  //如果没用到Form.Item的props，可以不使用。
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

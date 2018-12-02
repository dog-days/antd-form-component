//外部依赖包
import React from 'react';
// import AInput from 'antd/lib/input';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import AInput from 'antd/lib/input';
import Radio from 'antd/lib/radio';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import isArray from 'lodash/isArray';
//内部依赖包
import { randomKey, swapArrayItem } from '../../utils/util';
import Form from '../form';
import Input from './index';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

AInput.displayName = 'OriginalAntdComponent';

export default class MultipleInput extends Input {
  constructor(props) {
    super(props);
    this.itemKeys = [];
    // 保留原有value用法，value用法已废弃，使用initialValue代替
    let { value, initialValue = value } = this.props;
    if (!isArray(initialValue)) {
      initialValue = [initialValue];
    }
    initialValue.forEach(v => {
      this.itemKeys.push(randomKey());
    });
  }
  componentType = 'multiple-input';
  static childContextTypes = {
    //是否是多层jsx包裹
    isAntdComponentDeep: PropTypes.bool,
    isArrayInput: PropTypes.bool,
  };

  getChildContext() {
    return {
      isAntdComponentDeep: true,
      isArrayInput: true,
    };
  }
  onRadioChange = index => {
    return e => {
      const { triggerEvent } = this.context;
      const data = this.itemKeys;
      switch (e.target.value) {
        case 'up':
          swapArrayItem(data, index, index - 1);
          triggerEvent('array-item-index-change', {
            name: this.props.name,
            arrayItemIndexs: data,
          });
          break;
        case 'down':
          swapArrayItem(data, index, index + 1);
          triggerEvent('array-item-index-change', {
            name: this.props.name,
            arrayItemIndexs: data,
          });
          break;
        case 'delete':
          data.splice(index, 1);
          break;
        default:
      }

      this.setState({});
    };
  };
  onPlusClickEvent = e => {
    this.itemKeys.push(randomKey());
    this.setState({});
  };
  getUpDisabled(index) {
    if (this.itemKeys.length === 1) {
      return true;
    }
    if (index === 0) {
      return true;
    }
  }
  getDownDisabled(index) {
    if (this.itemKeys.length === 1) {
      return true;
    }
    if (index === this.itemKeys.length - 1) {
      return true;
    }
  }
  render() {
    // 保留原有value用法，value用法已废弃，使用initialValue代替
    const { value = [], initialValue = value, ...other } = this.props;
    const size = this.context.size || 'default';
    return (
      <div
        className={classnames('afc-array-item clearfix', {
          'afc-array-item-small': size === 'small',
          'afc-array-item-default': size === 'default',
          'afc-array-item-large': size === 'large',
        })}
      >
        {this.itemKeys.map((v, k) => {
          if (k !== 0) {
            other.label = 'null';
          }
          if (initialValue[k] === undefined) {
            //因为下面需要转换成字符串了
            initialValue[k] = '';
          }
          const hideLabel = other.label === 'null' ? true : false;
          return (
            <Form.Item
              className={classnames({ 'afc-hide-label': hideLabel })}
              key={v}
            >
              {this.renderFormItem(
                <div className="afc-array-item-con">
                  <div className="afc-array-item-left">
                    <AInput />
                  </div>
                  <div className="afc-array-item-right">
                    <RadioGroup
                      className="afc-array-item-radiogroup"
                      onChange={this.onRadioChange(k)}
                      value=""
                      size={size}
                    >
                      <RadioButton value="up" disabled={this.getUpDisabled(k)}>
                        <Icon type="arrow-up" />
                      </RadioButton>
                      <RadioButton
                        value="down"
                        disabled={this.getDownDisabled(k)}
                      >
                        <Icon type="arrow-down" />
                      </RadioButton>
                      <RadioButton
                        value="delete"
                        disabled={this.itemKeys.length === 1}
                      >
                        <Icon type="delete" />
                      </RadioButton>
                    </RadioGroup>
                  </div>
                </div>,
                {
                  label: other.label,
                  //_-_这个特殊符号是为了防止可能存在的重复name
                  //同时用来提取前面的name值
                  name: other.name + '_-_' + v,
                  arrayItemIndexs: this.itemKeys,
                  //如果是数字转换成字符串
                  //input表单值不存在值为数字的情况。
                  initialValue: isArray(initialValue)
                    ? initialValue[k] + ''
                    : initialValue + '',
                }
              )}
            </Form.Item>
          );
        })}
        <Button
          type="primary"
          className="afc-array-item-plus"
          onClick={this.onPlusClickEvent}
        >
          <Icon type="plus" />
        </Button>
      </div>
    );
  }
}

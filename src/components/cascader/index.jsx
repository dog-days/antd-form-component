//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import ACascader from 'antd/lib/cascader';
//内部依赖包
import BasicComponent from '../basic-component';

export default class Cascader extends BasicComponent {
  componentType = 'casader';
  currentAntdComponent = ACascader;
}

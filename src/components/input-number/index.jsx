//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import AInputNumber from 'antd/lib/input-number';
//内部依赖包
import BasicComponent from '../basic-component';

export default class InputNumber extends BasicComponent {
  componentType = 'input-number';
  currentAntdComponent = AInputNumber;
}

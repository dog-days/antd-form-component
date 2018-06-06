//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import ACheckbox from 'antd/lib/checkbox';
//内部依赖包
import BasicComponent from '../basic-component';

export default class Checkbox extends BasicComponent {
  componentType = 'checkbox';
  currentAntdComponent = ACheckbox;
}
Checkbox.Group = class CheckboxGroup extends BasicComponent {
  componentType = 'checkbox-group';
  currentAntdComponent = ACheckbox.Group;
};

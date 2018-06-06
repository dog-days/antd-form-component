//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import ASelect from 'antd/lib/select';
//内部依赖包
import BasicComponent from '../basic-component';

export default class Select extends BasicComponent {
  currentAntdComponent = ASelect;
}
Select.Option = ASelect.Option;
Select.OptGroup = ASelect.OptGroup;

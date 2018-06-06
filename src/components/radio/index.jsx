//外部依赖包
import React from 'react';
// import PropTypes from 'prop-types';
import ARadio from 'antd/lib/radio';
//内部依赖包
import BasicComponent from '../basic-component';

const Radio = function(props) {
  return <ARadio {...props} />;
};

Radio.Group = class RadioGroup extends BasicComponent {
  componentType = 'radio-group';
  currentAntdComponent = ARadio.Group;
};
export default Radio;

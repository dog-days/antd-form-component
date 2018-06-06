//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import ADatePicker from 'antd/lib/date-picker';
//内部依赖包
import BasicComponent from '../basic-component';

export default class DatePicker extends BasicComponent {
  currentAntdComponent = ADatePicker;
}
DatePicker.RangePicker = class RangePicker extends BasicComponent {
  currentAntdComponent = ADatePicker.RangePicker;
};
DatePicker.MonthPicker = class MonthPicker extends BasicComponent {
  currentAntdComponent = ADatePicker.MonthPicker;
};
DatePicker.WeekPicker = class WeekPicker extends BasicComponent {
  currentAntdComponent = ADatePicker.WeekPicker;
};

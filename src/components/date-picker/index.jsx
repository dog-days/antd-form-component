//外部依赖包
// import React from 'react';
// import PropTypes from 'prop-types';
import ADatePicker from 'antd/lib/date-picker';
//内部依赖包
import BasicComponent from '../basic-component';

export default class DatePicker extends BasicComponent {
  componentType = 'date-picker';
  currentAntdComponent = ADatePicker;
}
DatePicker.RangePicker = class RangePicker extends BasicComponent {
  componentType = 'range-picker';
  currentAntdComponent = ADatePicker.RangePicker;
};
DatePicker.MonthPicker = class MonthPicker extends BasicComponent {
  componentType = 'month-picker';
  currentAntdComponent = ADatePicker.MonthPicker;
};
DatePicker.WeekPicker = class WeekPicker extends BasicComponent {
  componentType = 'week-picker';
  currentAntdComponent = ADatePicker.WeekPicker;
};

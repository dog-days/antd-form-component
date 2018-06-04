import React from 'react';
import PropTypes from 'prop-types';

export default class Form extends React.Component {
  static create() {
    class Decorator extends React.Component {
      static childContextTypes = {
        form: PropTypes.object.isRequired,
      };

      getChildContext() {
        return {
          form: this.form,
        };
      }
      form = {
        getFieldDecorator() {},
        getFieldsError() {},
        getFieldError() {},
        getFieldsValue() {},
        getFieldValue() {},
        setFields() {},
        resetFields() {},
        setFieldsValue() {},
        validateFields() {},
      };
      render() {
        var WrapperComponent = this.getWrapperComponent();
        return <WrapperComponent {...this.props} form={this.form} />;
      }
    }
    return WrappedComponent => {
      function getDisplayName(WrappedComponent) {
        return (
          WrappedComponent.displayName ||
          WrappedComponent.name ||
          'WrappedComponent'
        );
      }
      Decorator.displayName = `form(${getDisplayName(WrappedComponent)})`;
      Decorator.prototype.getWrapperComponent = () => WrappedComponent;
      return Decorator;
    };
  }
  render() {
    return false;
  }
}

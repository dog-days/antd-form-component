import PropTypes from 'prop-types';

export default function(component) {
  // component.prototype.originalRender = component.prototype.render;
  component.contextTypes = {
    ...component.contextTypes,
    form: PropTypes.object,
    locale: PropTypes.object,
  };
  component.prototype = Object.create(component.prototype, {
    locale: {
      get: function() {
        if (!this._tempLocale) {
          //context.locale是getter
          this._tempLocale = {
            ...this.context.locale,
            ...this.props.locale,
          };
        }
        return this._tempLocale;
      },
    },
  });
  return component;
}

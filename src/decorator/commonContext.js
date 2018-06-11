import PropTypes from 'prop-types';

export default function(component) {
  // component.prototype.originalRender = component.prototype.render;
  component.contextTypes = {
    ...component.contextTypes,
    form: PropTypes.object,
    FormItem: PropTypes.func,
    locale: PropTypes.object,
    useForm: PropTypes.bool,
  };
  return component;
}

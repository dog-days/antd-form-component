import PropTypes from 'prop-types';

export default function(component) {
  // component.prototype.originalRender = component.prototype.render;
  component.contextTypes = {
    ...component.contextTypes,
    form: PropTypes.object,
    FormItem: PropTypes.func,
    locale: PropTypes.object,
    useForm: PropTypes.bool,
    size: PropTypes.string,
    on: PropTypes.func,
    //由于form的trigger覆盖了，所以使用了triggerEvent
    triggerEvent: PropTypes.func,
  };
  return component;
}

export default function(component) {
  component.prototype.originalRender = component.prototype.render;
  component.prototype.render = function() {
    const { name } = this.props;
    if (!name) {
      console.error('Input props.name is isRequired.');
      return false;
    }
    return this.originalRender();
  };
  return component;
}

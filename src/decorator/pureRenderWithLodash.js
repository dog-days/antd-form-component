import isArray from 'lodash/isArray';
import isEqualWith from 'lodash/isEqualWith';
import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
//如果函数对比，一律当做相等
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = hasOwnProperty.bind(objB);
  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i];

    if (objA[keyA] === objB[keyA]) {
      continue;
    }
    if (isFunction(objA[keyA])) {
      //函数不做对比，直接当做相同
      //因为函数一般都是定义好的
      continue;
    }
    // special diff with Array or Object
    if (isArray(objA[keyA])) {
      if (!isArray(objB[keyA]) || objA[keyA].length !== objB[keyA].length) {
        return false;
      } else if (
        !isEqualWith(objA[keyA], objB[keyA], function(objValue, othValue) {
          if (isFunction(objValue)) {
            //因为函数一般都是定义好的
            return true;
          }
        })
      ) {
        return false;
      }
    } else if (isPlainObject(objA[keyA])) {
      if (
        !isPlainObject(objB[keyA]) ||
        !isEqualWith(objA[keyA], objB[keyA], function(objValue, othValue) {
          if (isFunction(objValue)) {
            //函数不做对比，直接当做相同
            //因为函数一般都是定义好的
            return true;
          }
        })
      ) {
        return false;
      }
    } else if (
      !bHasOwnProperty(keysA[i]) ||
      objA[keysA[i]] !== objB[keysA[i]]
    ) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

function shouldComponentUpdate(nextProps, nextState) {
  return shallowCompare(this, nextProps, nextState);
}
function pureRenderDecorator(component) {
  component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  return component;
}
export { shallowEqual, shallowCompare };
export default pureRenderDecorator;

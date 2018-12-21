import _ from 'lodash';

function serialize(params, obj, traditional, scope) {
  let type,
    array = _.isArray(obj),
    hash = _.isObject(obj);
  _.each(obj, function(value, key) {
    type = typeof value;
    if (scope) {
      if (array) {
        key = scope;
      } else {
        key =
          scope +
          '[' +
          (hash || type === 'object' || type === 'array' ? key : '') +
          ']';
      }
    }
    // handle data in serializeArray() format
    if (!scope && array) {
      params.add(value.name, value.value);
    }
    // recurse into nested objects
    else if (type === 'array' || (!traditional && type === 'object')) {
      serialize(params, value, traditional, key);
    } else {
      params.add(key, value);
    }
  });
}

export default function param(obj, traditional) {
  let params = [];
  params.add = function(key, value) {
    if (_.isFunction(value)) {
      value = value();
    }
    if (value == null) {
      value = '';
    }
    this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  };
  serialize(params, obj, traditional);
  return params.join('&').replace(/%20/g, '+');
}

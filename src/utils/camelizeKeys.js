/* Credits - https://github.com/substack/camelize/blob/master/index.js */
import _ from 'lodash';
const camelcase = _.camelCase;
const isArray = _.isArray;
const isDate = _.isDate;
const isRegex = _.isRegExp;

const reduce = (xs, f, acc) => {
  if (xs.reduce) {
    return xs.reduce(f, acc);
  }
  for (let i = 0; i < xs.length; i++) {
    acc = f(acc, xs[i], i);
  }
  return acc;
};

const map = (xs, f) => {
  if (xs.map) {
    return xs.map(f);
  }
  const res = [];
  for (let i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
};

const walk = obj => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (isDate(obj) || isRegex(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return map(obj, walk);
  }
  return reduce(
    _.keys(obj),
    (acc, key) => {
      const camel = camelcase(key);
      acc[camel] = walk(obj[key]);
      return acc;
    },
    {},
  );
};

export default obj => {
  if (typeof obj === 'string') {
    return camelcase(obj);
  }
  return walk(obj);
};

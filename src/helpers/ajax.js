import axios from 'axios';
import _ from 'lodash';
import { camelizeKeys, toFormData } from '../utils';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const obj = {};

const isSensitiveKey = (key = '') =>
  /(password|token|secret|captcha|authorization|apikey|api_key|keyvalue)/i.test(
    key,
  );

const sanitizePayloadForLogs = (payload) => {
  if (!payload) {
    return payload;
  }

  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    return '[form-data]';
  }

  if (typeof payload !== 'object') {
    return payload;
  }

  return Object.keys(payload).reduce((sanitizedPayload, key) => {
    if (isSensitiveKey(key)) {
      sanitizedPayload[key] = '[REDACTED]';
      return sanitizedPayload;
    }

    sanitizedPayload[key] = payload[key];
    return sanitizedPayload;
  }, {});
};

const appendPayloadToUrl = (url, payload) => {
  if (!payload || typeof payload !== 'object') {
    return url;
  }

  const queryParams = new URLSearchParams();

  Object.keys(payload).forEach((key) => {
    const value = payload[key];

    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((arrayItem) => {
        queryParams.append(key, arrayItem);
      });
      return;
    }

    queryParams.append(key, value);
  });

  const serializedQuery = queryParams.toString();
  if (!serializedQuery) {
    return url;
  }

  const hasQuery = url.includes('?');
  return `${url}${hasQuery ? '&' : '?'}${serializedQuery}`;
};

['get', 'post', 'postJSON', 'all'].forEach(function (method) {
  obj[method] = function (url, payload, settings = {}) {
    /* Request will be aborted after 30 seconds */
    settings = {
      timeout: 30000,
      dataType: 'json',
      crossDomain: true,
      isTokenRequired: true,
      shouldCamelizeKeys: true,
      ...settings,
    };

    if (cookies.get('loggedIn') && settings.isTokenRequired) {
      payload = {
        // eslint-disable-next-line camelcase
        access_token: cookies.get('loggedIn'),
        ...payload,
      };
    }

    return new Promise(function (resolve, reject) {
      let methodArgs = [];
      /*
          If ajax.post is used, by default sending form data
          use postJSON instead for json data
      */
      if (method === 'post') {
        if (payload && payload instanceof FormData !== true) {
          payload = toFormData(payload);
        }

        settings.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...settings.headers,
        };
      } else if (method === 'get') {
        if (payload) {
          url = appendPayloadToUrl(url, payload);
        }
      }

      const methodsToAxiosMethodsMap = {
        get: 'get',
        post: 'post',
        postJSON: 'post',
        all: 'all',
      };

      if (method === 'all') {
        methodArgs = [url];
      } else if (method === 'get') {
        methodArgs = [url, settings];
      } else {
        methodArgs = [url, payload, settings];
      }

      axios[methodsToAxiosMethodsMap[method]].apply({}, methodArgs).then(
        function (data = {}, ...restSuccessArgs) {
          const statusCode = _.get(data, 'status');
          /*
              Send only api resonse
          */
          let responseData = { statusCode, ..._.get(data, 'data') };

          if (method === 'all') {
            responseData = data;
            responseData.statusCode = statusCode;
          }

          if (payload) {
            responseData.requestPayload = sanitizePayloadForLogs(payload);
          }

          resolve(
            settings.shouldCamelizeKeys
              ? camelizeKeys(responseData)
              : responseData,
            ...restSuccessArgs,
          );
        },
        function (data = {}, ...restErrorArgs) {
          // If request is canceled by user
          if (axios.isCancel(data)) {
            reject(data);
          }

          const statusCode = _.get(data, 'response.status', -1);
          let responseData = { statusCode, ..._.get(data, 'response.data') };

          if (method === 'all') {
            responseData = data;
            responseData.statusCode = statusCode;
          }

          if (payload) {
            responseData.requestPayload = sanitizePayloadForLogs(payload);
          }

          reject(camelizeKeys(responseData), ...restErrorArgs);
        },
      );
    });
  };
});

export default obj;

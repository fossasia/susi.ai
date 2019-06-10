import axios from 'axios';
import _ from 'lodash';
import { camelizeKeys, toFormData } from '../utils';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const obj = {};

['get', 'post', 'postJSON', 'all'].forEach(function(method) {
  obj[method] = function(url, payload, settings = {}) {
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

    return new Promise(function(resolve, reject) {
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
          url += `?${Object.keys(payload)
            .map(key => key + '=' + payload[key])
            .join('&')}`;
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
        function(data = {}, ...restSuccessArgs) {
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
            responseData.requestPayload = payload;
          }

          resolve(
            settings.shouldCamelizeKeys
              ? camelizeKeys(responseData)
              : responseData,
            ...restSuccessArgs,
          );
        },
        function(data = {}, ...restErrorArgs) {
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
            responseData.requestPayload = payload;
          }

          reject(camelizeKeys(responseData), ...restErrorArgs);
        },
      );
    });
  };
});

export default obj;

import $ from 'jquery';
import urls from './utils/urls';

const url = `${urls.API_URL}/aaa/getApiKeys.json`;

/* global module */

$.ajax({
  url: url,
  dataType: 'json',
  crossDomain: false,
  timeout: 3000,
  async: true,
}).done(function(output) {
  module.exports.MAP_KEY = output.keys.MAP_KEY;
  module.exports.CAPTCHA_KEY = output.keys.CAPTCHA_KEY;
  module.exports.BLOG_KEY = output.keys.BLOG_KEY;
});

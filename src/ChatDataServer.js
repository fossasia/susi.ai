let NETWORK_LATENCY = 300;

let messages = [
  {
    id: 'm_2',
    threadID: 't_1',
    threadName: 'SUSI',
    authorName: 'SUSI',
    text: null,
    timestamp: Date.now() - 89999
  }];

let threadNameMap = (function () {
  let map = {};
  messages.forEach(({ threadID, threadName }) => {
    map[threadID] = threadName;
  });
  return map;
})();

export function getMessages(callback) {
  setTimeout(() => {
    callback(messages);
  }, NETWORK_LATENCY);
};


export function postMessage(message, callback) {
  let timestamp = Date.now();
  let id = 'm_' + timestamp;
  let threadID = message.threadID;
  let messageCheck = message.text;
  let emojio = new RegExp(['(\\:\\w+\\:|\\<[\\/\\\\]?3|',
                          '[\\(\\)\\\\\\D|\\*\\$][\\-\\^]?[\\:\\;\\=]',
                          '|[\\:\\;\\=B8][\\-\\^]?[3DOPp\\@\\$\\*\\\\\\)\\(\\/\\|])',
                          '(?=\\s|[\\!\\.\\?]|$)'].join(''));
  let htmlReg = new RegExp(['<(br|basefont|hr|input|source|frame|param|area|meta|',
                            '!--|col|link|option|base|img|wbr|!DOCTYPE).*?>|',
                            '<(a|abbr|acronym|address|applet|article|aside|audio|b|bdi|bdo|big',
                            '|blockquote|body|button|canvas|caption|center|cite|code|colgroup',
                            '|command|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed',
                            '|fieldset|figcaption|figure|font|footer|form|frameset|head|header',
                            '|hgroup|h1|h2|h3|h4|h5|h6|html|i|iframe|ins|kbd|keygen|label|legend',
                            '|li|map|mark|menu|meter|nav|noframes|noscript|object|ol|optgroup',
                            '|output|p|pre|progress|q|rp|rt|ruby|s|samp|script|section|select',
                            '|small|span|strike|strong|style|sub|summary|sup|table|tbody|td',
                            '|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video).*?<\\/\\2>'].join(''));
  if (emojio.test(messageCheck) || htmlReg.test(messageCheck)) {
    messageCheck = message.text;
  }
  else {
    messageCheck = message.text.replace(/^[`~><%^&!@#*()_|+=;:"'<>\{\}\[\]\\\/]*/, ' ');
    messageCheck = messageCheck.replace(/[`~><$%^&@#*(_|+=:;<>"'\{\}\[\]\\\/]*$/, ' ');
  }
  let createdMessage = {
    id,
    threadID,
    threadName: threadNameMap[threadID],
    authorName: message.authorName,
    text: messageCheck,
    timestamp
  };


  messages.push(createdMessage);

  setTimeout(() => {
    callback(createdMessage);
  }, NETWORK_LATENCY);
};


export function postSUSIMessage(message, callback) {

  messages.push(message);


  setTimeout(() => {
    callback(message);
  }, NETWORK_LATENCY);

}

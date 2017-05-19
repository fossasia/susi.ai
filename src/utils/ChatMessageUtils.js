import $ from 'jquery'
export function convertRawMessage(rawMessage, currentThreadID) {
  return {
    ...rawMessage,
    date: new Date(rawMessage.timestamp),
    isRead: rawMessage.threadID === currentThreadID
  };
};

export function getCreatedMessageData(text, currentThreadID) {
  var timestamp = Date.now();
  return {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'You', 
    date: new Date(timestamp),
    text: text,
    isRead: true
  };
};

export function getSUSIMessageData(createdMessage, currentThreadID) {
  var timestamp = Date.now();

  let receivedMessage =  {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'SUSI', // hard coded for the example
    date: new Date(timestamp),
    text: '',
    response: {},
    isRead: true
  };

  $.ajax({
    url: 'http://api.asksusi.com/susi/chat.json?q='+createdMessage.text,
    dataType: 'jsonp',
    jsonpCallback: 'p',
    jsonp: 'callback',
    crossDomain: true,
    timeout: 3000,
    async: false,
    success: function (response) {
       receivedMessage.text = response.answers[0].actions[0].expression;
       receivedMessage.response = response;
      },
    error: function(errorThrown) { 
      console.log(errorThrown);      

    } 
  });
  
  return receivedMessage;
}
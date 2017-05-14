
let NETWORK_LATENCY = 1300;

let messages = [
  {
    id: 'm_2',
    threadID: 't_1',
    threadName: 'SUSI',
    authorName: 'SUSI',
    text: '',
    timestamp: Date.now() - 89999
  }];

let threadNameMap = (function () {
  let map = {};
  messages.forEach(({threadID, threadName}) => {
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

  let createdMessage = {
    id,
    threadID,
    threadName: threadNameMap[threadID],
    authorName: message.authorName,
    text: message.text,
    timestamp
  };


  messages.push(createdMessage);

  setTimeout(() => {
    callback(createdMessage);
  }, NETWORK_LATENCY);
};


export function postSUSIMessage(message, callback) {

  let timestamp = Date.now();
  let id = 'm_' + timestamp;
  let threadID = message.threadID;

   let receivedSUSIMessage = {
    id,
    threadID,
    threadName: "SUSI",
    authorName: "SUSI",
    text: message.text,
    timestamp
  };
  messages.push(receivedSUSIMessage);
  setTimeout(() => {
    callback(receivedSUSIMessage);
  }, NETWORK_LATENCY);

}
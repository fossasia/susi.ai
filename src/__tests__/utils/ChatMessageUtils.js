import * as ChatMessageUtils from '../../utils/ChatMessageUtils';

it('check getSUSIMessageData util', () => {
  const timestamp = Date.now();
  const message = {
    id: 'm_' + timestamp,
    threadID: 't_1',
    authorName: 'SUSI',
    text: 'Hello',
    response: {},
    date: new Date(timestamp),
    isRead: true,
    responseTime: 123,
  };
  const getSUSIMessageData = ChatMessageUtils.getSUSIMessageData(
    message,
    't_1',
  );
  expect(getSUSIMessageData.threadID).toBe(message.threadID);
  expect(getSUSIMessageData.authorName).toBe(message.authorName);
  expect(getSUSIMessageData.text).toBe(message.text);
  expect(getSUSIMessageData.response).toBe(message.response);
});

it('check getCreatedMessageData util', () => {
  const timestamp = Date.now();
  const messageText = 'Hello';
  const currentThreadID = 't_1';
  const message = {
    id: 'm_' + timestamp,
    threadID: currentThreadID,
    authorName: 'You',
    date: new Date(timestamp),
    text: messageText,
    isRead: true,
  };
  const chatMessage = ChatMessageUtils.getCreatedMessageData(
    messageText,
    currentThreadID,
  );
  expect(chatMessage.threadID).toBe(message.threadID);
  expect(chatMessage.authorName).toBe(message.authorName);
  expect(chatMessage.text).toBe(message.text);
  expect(chatMessage.isRead).toBeTruthy();
});

it('check convertRawMessage util', () => {
  const currentThreadID = 't_1';
  const rawMessage = {
    authorName: 'SUSI',
    id: 'm_2',
    text: 'hi',
    threadID: 't_1',
    threadName: 'SUSI',
    timestamp: 1495791592097,
  };
  const convertRawMessage = ChatMessageUtils.convertRawMessage(
    rawMessage,
    currentThreadID,
  );

  expect(convertRawMessage.threadID).toBe(rawMessage.threadID);
  expect(convertRawMessage.authorName).toBe(rawMessage.authorName);
  expect(convertRawMessage.threadName).toBe(rawMessage.threadName);
  expect(convertRawMessage.isRead).toBeTruthy();
});

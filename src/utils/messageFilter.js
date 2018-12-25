export const getAllUserMessages = (messages, messagesByID, order) => {
  let userMessageHistory = [];
  messages.forEach(id => {
    if (messagesByID[id].authorName === 'You' && messagesByID[id].text) {
      userMessageHistory.push(messagesByID[id].text);
    }
  });
  return order === 'REVERSE'
    ? userMessageHistory.reverse()
    : userMessageHistory;
};

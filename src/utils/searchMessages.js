export const searchMessages = (
  messages,
  messagesByID,
  searchText,
  isCaseSensitive,
) => {
  let markingData = {
    markedMessagesByID: {},
    markedIDs: [],
    markedIndices: [],
  };

  messages.forEach((id, index) => {
    const orignalMessageText = messagesByID[id].text;
    let messageCopy = { ...messagesByID[id] };
    let messageText = orignalMessageText;
    if (orignalMessageText) {
      if (!isCaseSensitive) {
        searchText = searchText.toLowerCase();
        messageText = messageText.toLowerCase();
      }
      const match = messageText.indexOf(searchText);
      if (match !== -1) {
        messageCopy.mark = {
          searchText,
          isCaseSensitive,
        };
        markingData.markedIDs = [messageCopy.id, ...markingData.markedIDs];
        markingData.markedIndices = [index, ...markingData.markedIndices];
      }
      markingData.markedMessagesByID[id] = messageCopy;
    }
  });

  return markingData;
};

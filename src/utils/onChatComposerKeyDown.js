const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;

const onChatComposerKeyDown = (keyCode, messageHistory, currentIndex) => {
  switch (keyCode) {
    case UP_KEY_CODE: {
      const newMessageIndex = (currentIndex + 1) % messageHistory.length;
      return {
        message: messageHistory[newMessageIndex],
        newMessageIndex: newMessageIndex,
      };
    }
    case DOWN_KEY_CODE: {
      if (currentIndex - 1 === -1) {
        const newMessageIndex = messageHistory.length - 1;
        return {
          message: messageHistory[newMessageIndex],
          newMessageIndex: newMessageIndex,
        };
      }
      const newMessageIndex = currentIndex - 1;
      return {
        message: messageHistory[newMessageIndex],
        newMessageIndex: newMessageIndex,
      };
    }
    default:
      return {
        message: '',
        newMessageIndex: -1,
      };
  }
};

export default onChatComposerKeyDown;

import { formatUserMessage, formatSusiMessage } from './formatMessage';
import { getSusiReply } from '../apis';
import mobileView from './isMobileView';

const isMobileView = mobileView();

export default function({
  text,
  voice,
  createMessage,
  createSusiMessage,
  mode,
  setPendingUserMessage,
  setChatMode,
  pendingUserMessage,
}) {
  if (mode === 'minimize') {
    setPendingUserMessage({ pendingUserMessage: text }).then(() => {
      setChatMode({
        mode: isMobileView ? 'fullScreen' : 'preview',
      });
    });
  } else {
    formatUserMessage({
      text,
      voice,
    }).then(userMessage => {
      createMessage(userMessage)
        .then(() => {
          getSusiReply(userMessage).then(response => {
            formatSusiMessage({
              response,
              voice,
              // eslint-disable-next-line max-nested-callbacks
            }).then(susiMessage => {
              createSusiMessage(susiMessage);
              !!pendingUserMessage &&
                setPendingUserMessage({ pendingUserMessage: null });
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
}

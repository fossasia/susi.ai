/* eslint-disable max-nested-callbacks */
import { formatUserMessage, formatSusiMessage } from './formatMessage';
import { getSusiReply } from '../apis';
import mobileView from './isMobileView';
import { TaskRunner, plannedFunction } from './scheduler';

let tasks = new TaskRunner();

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
            }).then(susiMessages => {
              susiMessages = Array.from(
                new Set(susiMessages.map(message => message.text)),
              ).map(text => {
                return susiMessages.find(message => message.text === text);
              });

              if (susiMessages[0].planDelay) {
                tasks.push(
                  plannedFunction,
                  () => createSusiMessage({ message: susiMessages[0] }),
                  susiMessages[0].planDelay,
                );
              } else {
                createSusiMessage({ message: susiMessages[0] });
              }

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

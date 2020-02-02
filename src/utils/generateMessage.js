/* eslint-disable max-nested-callbacks */
import { formatUserMessage, formatSusiMessage } from './formatMessage';
import { getSusiReply } from '../apis';
import mobileView from './isMobileView';
import { TaskRunner, plannedFunction } from './scheduler';

let tasks = new TaskRunner();

const isMobileView = mobileView();

export default async function({
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
    try {
      await setPendingUserMessage({ pendingUserMessage: text });
      setChatMode({
        mode: isMobileView ? 'fullScreen' : 'preview',
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      let userMessage = await formatUserMessage({
        text,
        voice,
      });
      await createMessage(userMessage);
      let response = await getSusiReply(userMessage);
      let susiMessages = await formatSusiMessage({
        response,
        voice,
      });
      susiMessages.forEach(eachMessage => {
        if (eachMessage.planDelay) {
          tasks.push(
            plannedFunction,
            () => createSusiMessage({ message: eachMessage }),
            eachMessage.planDelay,
          );
        } else {
          createSusiMessage({ message: eachMessage });
        }
      });
      !!pendingUserMessage &&
        setPendingUserMessage({ pendingUserMessage: null });
    } catch (error) {
      console.log(error);
    }
  }
}

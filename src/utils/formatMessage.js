import _ from 'lodash';

const userMessageGenerator = (text, timestamp, voice) => {
  return {
    id: 'm_' + timestamp,
    authorName: 'You',
    date: new Date(timestamp),
    text: text,
    type: 'message',
    voice: voice,
  };
};

const susiMessageGenerator = (timestamp, voice, response) => {
  const { answers } = response;

  const defaultAnswer = {
    data: [
      {
        '0': '',
        timezoneOffset: new Date().getTimezoneOffset(),
        language: 'en',
      },
    ],
    metadata: {
      count: 1,
    },
    actions: [
      {
        type: 'answer',
        expression: "Hmm... I'm not sure if i understand you correctly.",
      },
    ],
    skills: ['/en_0090_fail.json'],
    persona: {},
  };

  if (_.isEmpty(answers)) {
    response.answers.push(defaultAnswer);
  }

  let receivedMessage = {
    id: 'm_' + timestamp,
    authorName: 'SUSI',
    text: '',
    response: {},
    actions: [],
    websearchresults: [],
    rssResults: [],
    date: new Date(timestamp),
    type: 'message',
    voice: voice,
    lang: 'en-US',
  };

  try {
    receivedMessage.text = response.answers[0].actions[0].expression;
  } catch (err) {
    if (err instanceof TypeError) {
      let emptyData = [];
      emptyData[0] = [];
      emptyData[1] = {};
      response.answers = [];
      response.answers[0] = {
        actions: [],
        data: emptyData,
      };
      response.answers[0].actions[0] = {
        expression: 'Sorry, I could not understand what you just said.',
        language: 'en',
        type: 'answer',
      };
      receivedMessage.text = response.answers[0].actions[0].expression;
    }
  }

  // Setting message language
  receivedMessage.lang = response.answers[0].actions[0].language;

  receivedMessage.response = response;

  // Setting message actions
  let actions = [];
  response.answers[0].actions.forEach(actionobj => {
    actions.push(actionobj.type);
  });
  receivedMessage.actions = actions;

  // Websearch
  if (actions.indexOf('websearch') >= 0) {
    // TODO
  }
  // Rss
  else if (actions.indexOf('rss') >= 0) {
    // TODO
  }

  return receivedMessage;
};

export const formatUserMessage = payload => {
  const timestamp = Date.now();
  const { text, voice } = payload;
  payload.message = userMessageGenerator(text, timestamp, voice);
  return payload;
};

export const formatSusiMessage = payload => {
  const { voice } = payload;
  let { response } = payload;

  const timestamp = Date.now();
  let receivedMessage = susiMessageGenerator(timestamp, voice, response);

  payload = { message: receivedMessage };
  return payload;
};

export const createMessagePairArray = response => {
  let messagePairArray = [];
  response.cognitions.forEach(cognition => {
    const userMessage = userMessageGenerator(
      cognition.query,
      Date.parse(cognition.queryDate),
      false,
    );

    const susiMessage = susiMessageGenerator(
      Date.parse(cognition.answerDate),
      false,
      cognition,
    );

    messagePairArray.push({
      userMessage,
      susiMessage,
    });
  });
  return { messagePairArray };
};

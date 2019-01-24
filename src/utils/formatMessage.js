import _ from 'lodash';
import { getWebSearchResults } from '../apis/index';

const userMessageGenerator = (text, timestamp, voice) => {
  return Promise.resolve({
    id: 'm_' + timestamp,
    authorName: 'You',
    date: new Date(timestamp),
    text: text,
    type: 'message',
    voice: voice,
  });
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
    const actionIndex = actions.indexOf('websearch');
    const actionJson = response.answers[0].actions[actionIndex];
    const query = actionJson.query;
    let count = -1;
    if (actionJson.hasOwnProperty('count')) {
      count = actionJson.count;
    }
    return new Promise((resolve, reject) => {
      getWebSearchResults(query)
        .then(data => {
          if (count === -1) {
            count = data.relatedTopics.length + 1;
          }
          if (count > 0 && data.abstractText) {
            let abstractTile = {
              title: '',
              description: '',
              link: '',
              icon: '',
            };
            abstractTile.title = data.heading;
            abstractTile.description = data.abstractText;
            abstractTile.link = data.abstractURL;
            abstractTile.image = data.image;
            receivedMessage.websearchresults.push(abstractTile);
            count--;
          }
          for (
            let tileKey = 0;
            tileKey < data.relatedTopics.length && count > 0;
            tileKey++
          ) {
            const tileData = data.relatedTopics[tileKey];
            if (!tileData.hasOwnProperty('Name')) {
              let websearchTile = {
                title: '',
                description: '',
                link: '',
                icon: '',
              };
              if (tileData.result) {
                websearchTile.title = tileData.result.match(
                  /<a [^>]+>([^<]+)<\/a>/,
                )[1];
                websearchTile.description = tileData.text;
                websearchTile.link = tileData.firstURL;
                websearchTile.image = tileData.icon.URL;
                receivedMessage.websearchresults.push(websearchTile);
                count--;
              } else {
                break;
              }
            }
          }
          resolve(receivedMessage);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
  // Rss
  else if (actions.indexOf('rss') >= 0) {
    const actionIndex = actions.indexOf('rss');
    const actionJson = receivedMessage.response.answers[0].actions[actionIndex];
    let count = -1;
    if (actionJson.hasOwnProperty('count')) {
      count = actionJson.count;
    }
    let data = receivedMessage.response.answers[0].data;
    if (count === -1 || count > data.length) {
      count = data.length;
    }
    let pushedDataIndices = [];
    let remainingDataIndices = [];
    data.forEach((rssData, index) => {
      if (rssData.hasOwnProperty('image') && pushedDataIndices.length < count) {
        receivedMessage.rssResults.push(rssData);
        pushedDataIndices.push(index);
      } else {
        remainingDataIndices.push(index);
      }
    });
    count -= pushedDataIndices.length;
    if (count === 0) {
      return receivedMessage;
    }
    // previewURLForImage(
    //   receivedMessage,
    //   data,
    //   count,
    //   remainingDataIndices,
    //   0,
    //   0,
    // );
    return receivedMessage;
  }
  return Promise.resolve(receivedMessage);
};

export const formatUserMessage = payload => {
  const timestamp = Date.now();
  const { text, voice } = payload;
  payload.message = userMessageGenerator(text, timestamp, voice);
  return new Promise((resolve, reject) => {
    userMessageGenerator(text, timestamp, voice).then(message => {
      payload.message = message;
      resolve(payload);
    });
  });
};

export const formatSusiMessage = payload => {
  const { voice } = payload;
  let { response } = payload;

  const timestamp = Date.now();

  return new Promise((resolve, reject) => {
    susiMessageGenerator(timestamp, voice, response).then(receivedMessage => {
      resolve({ message: receivedMessage });
    });
  });
};

export const createMessagePairArray = response => {
  let promisePairArray = [];
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

    const promisePair = new Promise((resolve, reject) => {
      Promise.all([userMessage, susiMessage]).then(resolvedPair => {
        resolve({
          userMessage: resolvedPair[0],
          susiMessage: resolvedPair[1],
        });
      });
    });

    promisePairArray = [...promisePairArray, promisePair];
  });

  return new Promise((resolve, reject) => {
    Promise.all(promisePairArray).then(resolvedPairArray => {
      resolve({ messagePairArray: resolvedPairArray });
    });
  });
};

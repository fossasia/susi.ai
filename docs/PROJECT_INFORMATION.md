# Project Information

## Speech Recognition and Synthesis

The SUSI.AI WebChat uses [Web Speech API](https://github.com/mdn/web-speech-api/) for speech recognition and synthesis. To test whether your browser supports Text To Speech, open your browser console and run the following:

```
var msg = new SpeechSynthesisUtterance('Hello World');
window.speechSynthesis.speak(msg)
```

If you get speech output, then the Web API Speech Synthesis is supported by your browser and the text-to-speech features of SUSI.AI Web Chat will work. The Web Speech API has support for all latest Chrome/-ium browsers as mentioned in the [Web Speech API Mozilla docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). However there are a few bugs with some Chromium versions please check [this link](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=742758) on how to fix them locally.

## Accounting, Anonymous User, Logged in Users

SUSI.AI can be used anomymously or as a logged in user by using the account features. The advantage logged in users is, that they the interaction history is synced across devices. More about [accounting here](./docs/ACCOUNTING.md).

### Retrieving User Chat History

Whenever a user logs in he must be able to view his chat history in the chat client.
A user might also be using multiple chat clients, so the history across all platforms must be in sync.

A [memory servlet](https://github.com/fossasia/susi_server/blob/development/src/ai/susi/server/api/susi/UserService.java) is used to retrieve the user history.
>api.susi.ai/susi/memory.json?access_token=ACCESS_TOKEN

When the client makes a call to the server to the above endpoint  with the ```ACCESS_TOKEN``` of the logged in user,  the server returns a list of cognitions which contain susi responses to the queries in the history.

The response from the memory servlet is of the form:
```
{
	"cognitions" : [],
	"session" : {},
}
```
A sample SUSI.AI response is of the form :
```
{
	"query" :
	"answers" : [ {
		"data" : [],
		"actions" : []
	}],
}
```
So each cognition has ```query``` as well as  ```answer ``` and thus we get a conversation message pair in the chat history.

The cognitions contain a list of SUSI.AI responses of the above form using which chat history is rendered.

All the user messages are stored in a log file. The memory servlet digs out the history of the required user from the log file. The log uses the identity of the user and accesses only that information which has been stored for the user. If the user is not logged on, no information is available.
The conversation log is NOT stored for a particular IP. It’s stored for an Identity within the AAA system.
That identity can be represented with an email address, or there can be others.

Thus the synchronization of history across all chat platforms is maintained.

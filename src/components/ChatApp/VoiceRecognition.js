import { Component } from 'react';
import PropTypes from 'prop-types';

let counter = 0;

// eslint-disable-next-line
class VoiceRecognition extends Component {
  constructor (props) {
    super(props)

    const SpeechRecognition = window.SpeechRecognition
      || window.webkitSpeechRecognition
      || window.mozSpeechRecognition
      || window.msSpeechRecognition
      || window.oSpeechRecognition

    if (SpeechRecognition != null) {
      this.recognition = this.createRecognition(SpeechRecognition)
    } else {
      console.warn('The current browser does not support the SpeechRecognition API.');
    }
  }

  createRecognition = (SpeechRecognition) => {
    const defaults = {
      continuous: true,
      interimResults: true,
      lang: 'en-US'
    }

    const options = Object.assign({}, defaults, this.props)

    let recognition = new SpeechRecognition()

    recognition.continuous = options.continuous
    recognition.interimResults = options.interimResults
    recognition.lang = options.lang

    return recognition
  }

  bindResult = (event) => {
    let interimTranscript = ''
    let finalTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        counter++;
        interimTranscript += event.results[i][0].transcript
      }
    }
    if(counter === 0 ){
      interimTranscript = undefined;
    }
    this.props.onResult({interimTranscript,finalTranscript })
  }
  start = () => {
    this.recognition.start()
  }

  onspeechend = () => {
    this.recognition.stop()
  }

  stop = () => {
    this.recognition.stop()
  }

  abort = () => {
    this.recognition.abort()
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps ({ stop }) {
    if (stop) {
      this.stop()
    }
  }

  componentDidMount () {
    const events = [
      { name: 'start', action: this.props.onStart },
      { name: 'end', action: this.props.onEnd },
      { name: 'speechstart', action: this.props.onSpeechStart}
    ]

    events.forEach(event => {
      this.recognition.addEventListener(event.name, event.action)
    })

    this.recognition.addEventListener('result', this.bindResult)

    this.start()
  }

  componentWillUnmount () {
    this.abort()
  }

  render () {
    return null
  }
}

VoiceRecognition.propTypes = {
  onStart: PropTypes.func,
  onSpeechStart: PropTypes.func,
  onEnd : PropTypes.func,
  onResult: PropTypes.func,
  continuous: PropTypes.bool,
  lang: PropTypes.string,
  stop: PropTypes.bool
};

export default VoiceRecognition

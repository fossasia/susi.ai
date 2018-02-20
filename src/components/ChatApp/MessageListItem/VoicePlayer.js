import { Component } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';

class VoicePlayer extends Component {
  constructor (props) {
    super(props)

    if ('speechSynthesis' in window) {
      this.speech = this.createSpeech()
    } else {
      console.warn('The current browser does not support the speechSynthesis API.')
    }
    this.state = {
      started: false,
      playing: false
    }
  }

  createSpeech = () => {
    const defaults = {
      text: '',
      volume: 1,
      rate: UserPreferencesStore.getSpeechRate(),
      pitch: UserPreferencesStore.getSpeechPitch(),
      lang: UserPreferencesStore.getTTSLanguage(),
    }
    let speech = new SpeechSynthesisUtterance()
    Object.assign(speech, defaults, this.props)
    return speech
  }

  speak = () => {
    window.speechSynthesis.speak(this.speech)
    this.setState({ started: true, playing: true })
  }

  cancel = () => {
    window.speechSynthesis.cancel()
    this.setState({ started: false, playing: false })
  }

  pause = () => {
    window.speechSynthesis.pause()
    this.setState({ playing: false })
  }

  resume = () => {
    window.speechSynthesis.resume()
    this.setState({ playing: true })
  }

  componentWillReceiveProps ({ pause }) {
    if (pause && this.state.playing && this.state.started) {
      return this.pause()
    }

    if (!pause && !this.state.playing && this.state.started) {
      return this.resume()
    }
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount () {
    const events = [
      { name: 'start', action: this.props.onStart }
    ]

    events.forEach(e => {
      this.speech.addEventListener(e.name, e.action)
    })

    this.speech.addEventListener('end', () => {
      this.setState({ started: false })
      this.props.onEnd()
    })

    if (this.props.play) {
      this.speak()
    }
  }

  componentWillUnmount () {
    this.cancel()
  }

  render () {
    return null
  }
}

VoicePlayer.propTypes = {
  play: PropTypes.bool,
  pause: PropTypes.bool,
  text: PropTypes.string,
  lang: PropTypes.string,
  rate: PropTypes.number,
  pitch: PropTypes.number,
  onStart: PropTypes.func,
  onEnd: PropTypes.func
};
export default VoicePlayer

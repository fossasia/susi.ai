import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class VoicePlayer extends Component {
  constructor(props) {
    super(props);

    if ('speechSynthesis' in window) {
      this.speech = this.createSpeech();
    } else {
      console.warn(
        'The current browser does not support the speechSynthesis API.',
      );
    }
    this.state = {
      started: false,
      playing: false,
    };
  }

  createSpeech = () => {
    const { lang, rate, pitch } = this.props;
    const defaults = {
      text: '',
      volume: 1,
      rate,
      pitch,
      lang,
    };
    let speech = new SpeechSynthesisUtterance();
    Object.assign(speech, defaults, this.props);
    return speech;
  };

  speak = () => {
    window.speechSynthesis.speak(this.speech);
    this.setState({ started: true, playing: true });
  };

  cancel = () => {
    window.speechSynthesis.cancel();
    this.setState({ started: false, playing: false });
  };

  pause = () => {
    window.speechSynthesis.pause();
    this.setState({ playing: false });
  };

  resume = () => {
    window.speechSynthesis.resume();
    this.setState({ playing: true });
  };

  componentDidUpdate({ pause }) {
    const { playing, started } = this.state;
    if (pause && playing && started) {
      return this.pause();
    }

    if (!pause && !playing && started) {
      return this.resume();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const events = [{ name: 'start', action: this.props.onStart }];

    events.forEach(e => {
      if (this.speech) {
        this.speech.addEventListener(e.name, e.action);
      }
    });

    this.speech.addEventListener('end', () => {
      this.setState({ started: false });
      this.props.onEnd();
    });

    if (this.props.play) {
      this.speak();
    }
  }

  componentWillUnmount() {
    this.cancel();
  }

  render() {
    return null;
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
  onEnd: PropTypes.func,
};

function mapStateToProps(store) {
  return {
    lang: store.settings.ttsLanguage,
    rate: store.settings.speechRate,
    pitch: store.settings.speechPitch,
  };
}

export default connect(
  mapStateToProps,
  null,
)(VoicePlayer);

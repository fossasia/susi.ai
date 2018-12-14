import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Footer from '../Footer/Footer.react';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import Modal from 'react-modal';
import urls from '../../utils/urls';
import { scrollToTopAnimation } from '../../utils/animateScroll';
import PlayCircle from 'material-ui/svg-icons/av/play-circle-filled';
import Close from 'material-ui/svg-icons/navigation/close';
import susiGif from '../../images/susi.gif';
import GIFDemo from '../../images/gif.gif';
import WebDemo from '../../images/web.gif';
import LocationDemo from '../../images/location.gif';
import JokesDemo from '../../images/joke.gif';
import FactsDemo from '../../images/fact.gif';
import MathDemo from '../../images/math.gif';
import susiSkill from '../../images/susi_skill.png';
import susiTestGif from '../../images/susi-test.gif';
import bots from '../../images/bots.jpg';
import githubText from '../../images/github-text-logo.png';
import manyLanguages from '../../images/many_languages.png';
import allDevices from '../../images/all_devices.png';
import androidMockup from '../../images/android-mockup.jpg';
import mapAndroid from '../../images/map-android.jpg';
import shield from '../../images/shield.svg';
import openSource from '../../images/open-source.png';
import Web from 'material-ui/svg-icons/av/web';
import GIF from 'material-ui/svg-icons/action/gif';
import Locationsvg from 'material-ui/svg-icons/communication/location-on';
import Action from 'material-ui/svg-icons/communication/chat-bubble';
import { RaisedButton } from 'material-ui';
import PlusOne from 'material-ui/svg-icons/social/plus-one';
import { ActionSearch } from 'material-ui/svg-icons';

import './Overview.css';
import { blue600 } from 'material-ui/styles/colors';
import { white, black } from 'material-ui/styles/colors';

const styles = {
  closingStyle: {
    position: 'absolute',
    zIndex: 120000,
    fill: '#fff',
    width: '40px',
    height: '40px',
    right: '1.5%',
    top: '20px',
    cursor: 'pointer',
  },
};
const buttonAttributes = [
  { label: 'Search', icon: <ActionSearch />, gif: WebDemo },
  { label: 'Location', icon: <Locationsvg />, gif: LocationDemo },
  { label: 'GIFs', icon: <GIF />, gif: GIFDemo },
  { label: 'Jokes', icon: <Action />, gif: JokesDemo },
  { label: 'Facts', icon: <Web />, gif: FactsDemo },
  { label: 'Math', icon: <PlusOne />, gif: MathDemo },
];

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifIndex: 0,
      isVideoModalOpen: false,
    };
  }
  // Toggle Video dialog

  toggleVideoModal = () => {
    this.setState(prevState => ({
      isVideoModalOpen: !prevState.isVideoModalOpen,
    }));
  };

  componentDidMount() {
    document.body.style.backgroundColor = '#fff';
    // Adding title tag to page
    document.title =
      'SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots.';
    //  Scrolling to top of page when component loads
    scrollToTopAnimation();
    this.exampleTime = setInterval(() => {
      const { gifIndex } = this.state;
      const newGifIndex = (gifIndex + 1) % 6;
      this.setState({ gifIndex: newGifIndex });
      this.changeGIF(newGifIndex);
    }, 7000);
  }

  componentWillUnmount() {
    clearInterval(this.exampleTime);
  }

  changeGIF(index) {
    this.setState({
      gifIndex: index,
    });
  }

  render() {
    const { gifIndex } = this.state;
    const { closingStyle } = styles;
    document.body.style.setProperty('background-image', 'none');
    return (
      <div>
        <StaticAppBar
          {...this.props}
          location={this.props.location}
          closeVideo={this.closeVideo}
        />

        <div className="section">
          <div className="section-container">
            <div className="hero">
              <img src={susiGif} style={{ margin: '20px 0' }} alt="Meet SUSI" />
              <h1>
                Meet SUSI.AI, Your Artificial Intelligence for Personal
                Assistants, Robots, Help Desks and Chatbots.
              </h1>
              <p>
                Ask it questions. Tell it to do things. Always ready to help.
              </p>
              <a
                onClick={this.toggleVideoModal}
                style={{
                  color: '#3367d6',
                  cursor: 'pointer',
                  position: 'relative',
                  lineHeight: '24px',
                  display: 'block',
                }}
              >
                <PlayCircle
                  style={{
                    fill: '#3367d6',
                    marginRight: '50px',
                  }}
                />
                <span className="watchStyle">Watch</span>
              </a>
            </div>
          </div>
        </div>
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">Ask it anything.</div>
            <p className="description__text">
              Search for the capital of Vietnam or find translations in
              different languages. Ask SUSI for your location, and what the
              weather’s like when you get there.
            </p>
          </div>
          <div className="img-container">
            <img src={susiTestGif} alt="susi-test" className="susi-test" />
          </div>
        </div>
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">Explore What it can do.</div>
            <p className="description__text">
              From finding GIF of your favorite cartoon to exploring new things
              that you never thought of before. Susi can do a lot of things that
              you might not expect. Here are some examples of what SUSI can do.
              <br />
              Don"t forget, these are only a few 😊
            </p>
            <div className="rowdiv">
              {buttonAttributes.map((button, index) => (
                <RaisedButton
                  className="example-btn"
                  label={button.label}
                  labelColor={gifIndex === index ? white : black}
                  backgroundColor={gifIndex === index ? blue600 : white}
                  onClick={e => this.changeGIF(index)}
                  icon={button.icon}
                />
              ))}
            </div>
          </div>
          <div className="img-container">
            {buttonAttributes.map((img, index) => (
              <img
                src={buttonAttributes[gifIndex].gif}
                style={gifIndex === index ? {} : { display: 'none' }}
                alt="susi-web"
                className="susi-test"
              />
            ))}
          </div>
        </div>
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">Tell it to do things.</div>
            <p className="description__text">
              SUSI can listen to you through the Mic and answer back on your
              Speaker. You can activate the assistant saying
              <b> &quot;Hi SUSI&quot;</b> already on many clients and devices.
              The more you talk with SUSI the better it gets. You can even tell
              SUSI to remember things.
            </p>
          </div>
          <div className="img-container">
            <img src={mapAndroid} alt="Map" className="android-mockup" />
          </div>
        </div>

        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">For your Smartphone</div>
            <p className="description__text">
              SUSI is available for <b>Android</b>
              &nbsp;and <b>iOS devices</b>. Download the App to have access to
              SUSI on the go.
            </p>
            <div className="description__text store_icons">
              <a
                className="playstore"
                rel="noopener noreferrer"
                target="_blank"
                href="https://play.google.com/store/apps/details?id=ai.susi"
              >
                {' '}
                Get it on Google Play
              </a>
              <a
                className="appstore"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/fossasia/susi_iOS"
              >
                {' '}
                Download on the App Store
              </a>
            </div>
          </div>
          <div className="img-container">
            <img
              src={androidMockup}
              alt="Android Mockup"
              className="android-mockup"
            />
          </div>
        </div>

        <div style={{ alignItems: 'unset' }} className="section_copy">
          <div className="column_section">
            <div className="conversation__description custom_description">
              <div className="img-container">
                <img src={bots} alt="Android Mockup" className="bots-mockup" />
              </div>
              <div className="description__heading">On many Platforms</div>
              <p className="description__text">
                <b>SUSI.AI</b> already runs on many chat services and social
                networks. We are developing plugins for all major services
                including &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_tweetbot"
                >
                  Twitter
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_fbbot"
                >
                  Facebook
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_linebot"
                >
                  Line
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_slackbot"
                >
                  Slack
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_wechatbot"
                >
                  We Chat
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_viberbot"
                >
                  Viber
                </a>, &nbsp;<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia/susi_gitterbot"
                >
                  Gitter
                </a>. Just set up SUSI on your channel and add &nbsp;<b>
                  @susi
                </b>{' '}
                in your conversations and SUSI is ready to help.
              </p>
            </div>
          </div>

          <div className="column_section">
            <div className="img-container">
              <img
                src={allDevices}
                alt="Android Mockup"
                className="bots-mockup"
              />
            </div>
            <div className="conversation__description custom_description">
              <div className="description__heading">For all Devices</div>
              <p className="description__text">
                <b>SUSI.AI</b> is available for any android, iOS device and also
                you can access the web chat application from this URL{' '}
                <a href={urls.CHAT_URL}>{urls.CHAT_URL}</a>
              </p>
            </div>
          </div>

          <div className="column_section">
            <div className="conversation__description custom_description">
              <div className="img-container">
                <img
                  src={manyLanguages}
                  alt="Android Mockup"
                  className="bots-mockup"
                />
              </div>
              <div className="description__heading">
                Use it in many Languages
              </div>
              <p className="description__text">
                You can use <b>SUSI.AI</b> in different languages. You can ask
                questions in many languages. SUSI is intelligent to identify and
                answer your question in your language.
              </p>
            </div>
          </div>
        </div>
        {/* section_copy ends */}

        <div className="section_center">
          <div className="center__description">
            <div className="description__heading">SUSI Skills</div>
            <p className="description__text">
              SUSI is having many skills. You can look at the collection of
              skills at
              <a
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                href={urls.SKILL_URL}
                target="_blank"
              >
                {' '}
                skills.susi.ai
              </a>. SUSI skills are divided into groups like knowledge,
              assistant, problem solving, entertainment, shopping and small
              talks. SUSI Skill development is easy and fun.{' '}
            </p>
          </div>
          <div className="img-container">
            <img src={susiSkill} alt="Skills" className="skillWiki" />
          </div>
        </div>

        <div className="section_copy safe_and_secure">
          <div className="conversation__description">
            <div className="description__heading">Safe and secure.</div>
            <p className="description__text">
              <b>SUSI.AI</b> is{' '}
              <b>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#000' }}
                  href="https://github.com/fossasia?utf8=%E2%9C%93&q=susi"
                >
                  Open Source
                </a>
              </b>. The code is always available for security reviews and can be
              improved by anyone with the knowledge and understanding online.
            </p>
            <div className="opensource-logos">
              <span className="opensource">
                <a
                  rel="noopener noreferrer"
                  href="https://opensource.org/"
                  target="_blank"
                >
                  <img src={openSource} alt="osi" />
                </a>
              </span>
              <span className="github_logo">
                <a
                  rel="noopener noreferrer"
                  href="https://github.com/fossasia?utf8=✓&q=susi"
                  target="_blank"
                >
                  <img src={githubText} alt="ghlogo" />
                </a>
              </span>
            </div>
          </div>
          <div className="img-container">
            <img src={shield} alt="Android Mockup" className="shield" />
          </div>
        </div>

        <Footer />

        {/* Video */}

        <Modal
          isOpen={this.state.isVideoModalOpen}
          className="Video-Modal"
          onRequestClose={this.toggleVideoModal}
          contentLabel="Assistant Video"
          overlayClassName="Video-Overlay"
        >
          <div className="video-container">
            <iframe
              id="player"
              type="text/html"
              frameBorder="0"
              allowFullScreen
              src="https://www.youtube.com/embed/tIG5griC-G0?enablejsapi=1&autoplay=1"
            />
            <Close style={closingStyle} onTouchTap={this.toggleVideoModal} />
          </div>
        </Modal>
      </div>
    );
  }
}
Overview.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Overview;

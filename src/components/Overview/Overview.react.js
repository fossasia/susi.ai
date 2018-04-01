import './Overview.css';
import $ from 'jquery';
import allDevices from '../../images/all_devices.png';
import androidMockup from '../../images/android-mockup.jpg';
import bots from '../../images/bots.jpg';
import Close from 'material-ui/svg-icons/navigation/close';
import Footer from '../Footer/Footer.react';
import githubText from '../../images/github-text-logo.png';
import manyLanguages from '../../images/many_languages.png';
import mapAndroid from '../../images/map-android.jpg';
import Modal from 'react-modal';
import openSource from '../../images/open-source.png';
import PlayCircle from 'material-ui/svg-icons/av/play-circle-filled';
import PropTypes from 'prop-types';
import shield from '../../images/shield.svg';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import susiGif from '../../images/susi.gif';
import susiSkill from '../../images/susi_skill.png';
import susiTestGif from '../../images/susi-test.gif';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import 'animate.css/animate.min.css';
import ScrollAnimation from 'react-animate-on-scroll';

class Overview extends Component{
  constructor(props){
    super(props);
    this.state={
      video:false,
    }
  }

  handleTitle = () => {
    this.props.history.push('/');
  }
  // Open Video Dialog and close login and sign up dialog
  handleVideo = () => this.setState({
    login: false,
    signup: false,
    video: true
  })
  // Close all the dialogs
  handleClose = () => this.setState({
    login: false,
    signup: false,
    video: false
  })
  // Close Video Dialog
  closeVideo = () => this.setState({
    video: false
  })

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  componentWillMount(){
    document.body.style.backgroundColor = '#fff';
  }


  componentDidMount() {
    // Adding title tag to page
    document.title = 'SUSI.AI - Open Source Artificial Intelligence for Personal Assistants, Robots, Help Desks and Chatbots.';
    //  Scrolling to top of page when component loads
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  render() {
    document.body.style.setProperty('background-image', 'none');
    const closingStyle = {
      position: 'absolute',
      zIndex: 120000,
      fill: '#fff',
      width: '40px',
      height: '40px',
      right: '20px',
      top: '20px',
      cursor: 'pointer'
    }

    return (

      <div>

        <StaticAppBar {...this.props}
          location={this.props.location} closeVideo={this.closeVideo} />

          <ScrollAnimation animateIn="fadeIn">
        <div className='section'>
          <div className='section-container'>
            <div className="hero">
              <img src={susiGif} style={{ margin: '20px 0' }} alt='Meet SUSI'/>
              <h1>
                Meet SUSI.AI,
                Your Artificial Intelligence for Personal Assistants,
                Robots, Help Desks and Chatbots.
              </h1>
              <p>Ask it questions. Tell it to do things. Always ready to help.</p>
              <a onClick={this.handleVideo} style={{
                color: '#3367d6',
                cursor: 'pointer', position: 'relative'
              }}>
                <PlayCircle style={{
                  fill: '#3367d6',
                  marginRight: '50px'
                }} /><span className='watchStyle'>Watch</span>
              </a>
            </div>
          </div>
        </div>
        </ScrollAnimation>

        <ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">Ask it anything.</div>
            <p className="description__text">
              Search for the capital of Vietnam or
                  find translations in different languages.
                  Ask SUSI for your location, and
                  what the weather’s like when you get there.</p>
          </div>
          <div className='img-container'>
            <img src={susiTestGif} alt='susi-test' className='susi-test' />
          </div>
        </div>
        </ScrollAnimation>


        <ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">Tell it to do things.</div>
            <p className="description__text">
              SUSI can listen to you through the Mic
                  and answer back on your Speaker.
                  You can activate the assistant saying
                  <b> &quot;Hi SUSI&quot;</b> already on many clients and devices.
                  The more you talk with SUSI the better it gets.
                  You can even tell SUSI to remember things.</p>
          </div>
          <div className='img-container'>
            <img src={mapAndroid} alt='Map' className='android-mockup' />
          </div>
        </div>
        </ScrollAnimation>


        <ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_copy">
          <div className="conversation__description">
            <div className="description__heading">For your Smartphone</div>
            <p className="description__text">SUSI is available for <b>Android</b>
              &nbsp;and <b>iOS devices</b>.
                   Download the App to have access to SUSI on the go.</p>
                   <div className="description__text store_icons">
                     <Link className="playstore"
                       target="_blank" to="https://play.google.com/store/apps/details?id=org.fossasia.susi.ai"> Get it on Google Play
                     </Link>
                     <Link className="appstore"
                       target="_blank" to="https://github.com/fossasia/susi_iOS"> Download on the App Store
                     </Link>
                   </div>
          </div>
          <div className='img-container'>
            <img src={androidMockup} alt='Android Mockup' className='android-mockup' />
          </div>
        </div>
        </ScrollAnimation>


        <ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_copy">

	          <div className="column_section">
	            <div className="conversation__description custom_description">
	              <div className='img-container'>
	                <img src={bots} alt='Android Mockup' className='bots-mockup' />
	              </div>
	              <div className="description__heading">On many Platforms</div>
	              <p className="description__text"><b>SUSI.AI</b> already runs on many chat
	                    services and social networks. We are developing plugins for all
	                    major services including
	                    &nbsp;<a href='https://github.com/fossasia/susi_tweetbot'>Twitter</a>,&nbsp;<a href='https://github.com/fossasia/susi_fbbot'>Facebook</a>,
	                    &nbsp;<a href='https://github.com/fossasia/susi_linebot'>Line</a>,
	                    &nbsp;<a href='https://github.com/fossasia/susi_slackbot'>Slack</a>,&nbsp;<a href='https://github.com/fossasia/susi_wechatbot'>We Chat</a>,
	                    &nbsp;<a href='https://github.com/fossasia/susi_viberbot'>Viber</a>,
	                    &nbsp;<a href='https://github.com/fossasia/susi_gitterbot'>Gitter</a>. Just set up SUSI on your channel and add&nbsp;<b>@susi</b> in your conversations and SUSI is ready to help.
	                    </p>
	            </div>
	          </div>

	          <div className="column_section">
	            <div className='img-container'>
	              <img src={allDevices} alt='Android Mockup' className='bots-mockup' />
	            </div>
	            <div className="conversation__description custom_description">
	              <div className="description__heading">For all Devices</div>
	              <p className="description__text"><b >SUSI.AI</b> is available for any android, iOS device and also you can access the web chat application from this URL <a href="https://chat.susi.ai">https://chat.susi.ai</a>
	              </p>
	            </div>
          	</div>

          <div className="column_section">
            <div className="conversation__description custom_description">
              <div className='img-container'>
                <img src={manyLanguages} alt='Android Mockup' className='bots-mockup' />
              </div>
              <div className="description__heading">Use it in many Languages</div>
              <p className="description__text">You can use <b>SUSI.AI</b> in different
                     languages. You can ask questions in many languages.
                      SUSI is intelligent to identify and
                       answer your question in your language.
                    </p>
            </div>

          </div>
        </div>
    </ScrollAnimation>{/* section_copy ends */}


    	<ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_center">
          <div className="center__description">
            <div className="description__heading">SUSI Skills</div>
            <p className="description__text">
              SUSI is having many skills. You can look at the collection of skills at
              <Link style={{ textDecoration: 'none' }} to="https://skills.susi.ai/" target="_blank"> skills.susi.ai</Link>.
              SUSI skills are divided into groups like knowledge,
              assistant, problem solving, entertainment, shopping
              and small talks. SUSI Skill development is easy and fun. </p>
          </div>
          <div className='img-container'>
            <img src={susiSkill} alt='Skills' className='skillWiki'/>
          </div>
        </div>
        </ScrollAnimation>


        <ScrollAnimation animateIn="fadeIn" offset="300" duration="3">
        <div className="section_copy safe_and_secure">
          <div className="conversation__description">

            <div className="description__heading">Safe and secure.</div>
            <p className="description__text"><b>SUSI.AI</b> is <b>
              <Link style={{ textDecoration: 'none', color: '#000' }}
                target="_blank" to="https://github.com/fossasia?utf8=%E2%9C%93&q=susi">Open Source</Link></b>. The code is always available for security reviews and can be improved by anyone with the knowledge and understanding online.</p>
                    <div className="opensource-logos">
                        <span className="opensource">
                          <Link to="https://opensource.org/" target="_blank">
                          <img src={openSource} alt='osi' />
                          </Link>
                        </span>
                        <span className="github_logo">
                          <Link to="https://github.com/fossasia?utf8=✓&q=susi" target="_blank">
                          <img src={githubText} alt='ghlogo' />
                          </Link>
                        </span>
                    </div>
                  </div>
                  <div className='img-container'>
                    <img src={shield} alt='Android Mockup' className='shield'  />
                  </div>
                </div>
                </ScrollAnimation>

        <Footer />

        {/* Video */}

        <Modal
          isOpen={this.state.video}
          className="Video-Modal"
          onRequestClose={this.handleClose}
          contentLabel="Assistant Video"
          overlayClassName="Video-Overlay">
          <div className="video-container">
            <iframe id="player" type="text/html" frameBorder="0" allowFullScreen
              src="https://www.youtube.com/embed/tIG5griC-G0?enablejsapi=1&autoplay=1"></iframe>
            <Close style={closingStyle} onTouchTap={this.handleClose} />
          </div>
        </Modal>
      </div>

    );
  };
}

Overview.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}

export default Overview;

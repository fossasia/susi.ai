import React, { Component } from 'react';
import susiAndroid from '../../images/susi-test.gif';
import susiiOSGif from '../../images/ios_demo.gif';
import susiDesktop from '../../images/susi.gif';
import './Devices.css';

import PropTypes from 'prop-types';
import StaticAppBar from '../StaticAppBar/StaticAppBar.react';
import $ from 'jquery';
import Footer from '../Footer/Footer.react';
import urls from '../../utils/urls';

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: false,
      initScrollTop: false,
    };
  }

  componentDidMount() {
    // Adding title tag to page
    document.title =
      'SUSI.AI - Open Source AI for Any Device, Android, iOS, Robots, Help Desks, Linux';
    //  Scrolling to top of page when component loads
    $('html, body').animate({ scrollTop: 0 }, 'fast');
  }

  render() {
    document.body.style.setProperty('background-image', 'none');
    return (
      <div>
        <StaticAppBar
          {...this.props}
          location={this.props.location}
          closeVideo={this.closeVideo}
        />

        <div className="head_section">
          <div className="container">
            <div className="heading">
              <h1>Devices</h1>
              <p>SUSI.AI is available on many platform</p>
            </div>
          </div>
        </div>

        <div className="device_section">
          <div className="device_description">
            <div className="heading">Android devices</div>
            <p className="text_description">
              SUSI.AI is available on android devices. Download the Android App
              to have access to SUSI on the go.
            </p>
            <div className="store_icons">
              <a 
                  className="play_store" 
                  href="https://play.google.com/store/apps/details?id=org.fossasia.susi.ai"
              >
                {' '}
                Get It on Google Play
              </a>
            </div>
          </div>
          <div className="img-container">
            <img src={susiAndroid} alt="susi-android" className="susi-test" />
          </div>
        </div>

        <div className="device_section">
          <div className="device_description">
            <div className="heading">iOS devices</div>
            <p className="text_description">
              SUSI.AI is available on iOS devices. Download the iOS App to have
              access to SUSI on the go.
            </p>
            <div className="store_icons">
              <a 
                  className="app_store" 
                  href="https://github.com/fossasia/susi_iOS"
              >
                {' '}
                Download on the App Store
              </a>
            </div>
          </div>
          <div className="img-container">
            <img src={susiiOSGif} alt="susi-iOS" className="susi-test" />
          </div>
        </div>

        <div className="device_section bottom_section">
          <div className="device_description">
            <div className="heading">Desktops and Laptops</div>
            <p className="text_description">
              You can use SUSI.AI Web Chat on your desktop and laptop. Start
              Chatting with SUSI.AI
              <a
                style={{ textDecoration: 'none' }}
                href={urls.CHAT_URL}
              >
                {' '}
                here
              </a>
            </p>
          </div>
          <div className="img-container">
            <img
              src={susiDesktop}
              alt="susi-webchat"
              className="susi-desktop"
            />
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

Devices.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};

export default Devices;

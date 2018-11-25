import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Translate from '../../Translate/Translate.react';
import urls from '../../../utils/urls';

const styles = {
  buttonStyle: {
    marginTop: '10px',
    marginBottom: '0px',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  raisedButtonStyle: {
    margin: 20,
    width: '220px',
  },
};

const initFacebookAPI = () => {
  window.fbAsyncInit = () => {
    window.FB.init({
      appId: '136831073699181',
      cookie: true,
      xfbml: true,
      version: 'v2.11',
    });
    window.FB.AppEvents.logPageView();
  };

  ((d, s, id) => {
    if (d.getElementsByTagName(s)[0]) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, 'script', 'facebook-jssdk');
};

const shareToFacebook = () => {
  window.FB.ui(
    {
      method: 'share',
      href: urls.CHAT_URL,
      caption: 'SUSI by FOSSASIA',
      hashtag: '#FOSSASIA',
      quote: 'Lets chat with susi, the open source personal assistant',
    },
    response => {},
  );
};

const ShareOnSocialMedia = props => {
  initFacebookAPI();
  const { buttonStyle, raisedButtonStyle } = styles;
  return (
    <div style={props.containerStyle}>
      <div>
        <div>
          <div style={buttonStyle}>
            <Translate text="Share about SUSI on Facebook" />
            <br />
            <RaisedButton
              label={<Translate text="Share on Facebook" />}
              style={raisedButtonStyle}
              backgroundColor="#3B5998"
              labelColor="#fff"
              icon={<FontIcon className="fa fa-facebook" />}
              keyboardFocused={false}
              onTouchTap={shareToFacebook}
            />
          </div>
          <div style={buttonStyle}>
            <Translate text="Share about SUSI on Twitter" />
            <br />
            <RaisedButton
              label={<Translate text="Share on Twitter" />}
              style={raisedButtonStyle}
              backgroundColor="#00aced"
              labelColor="#fff"
              icon={<FontIcon className="fa fa-twitter twitterIcon" />}
              keyboardFocused={false}
              onClick={() =>
                window.open(
                  'https://twitter.com/intent/tweet?text=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai_',
                  '_blank',
                )
              }
            />
          </div>
          <div style={buttonStyle}>
            <Translate text="Share about SUSI on Google +" />
            <br />
            <RaisedButton
              label={<Translate text="Share on Google+" />}
              style={raisedButtonStyle}
              backgroundColor="#d34836"
              labelColor="#fff"
              icon={<FontIcon className="fa fa-google-plus" />}
              keyboardFocused={false}
              onClick={() =>
                window.open(
                  `https://plus.google.com/share?url=${urls.CHAT_URL}`,
                  '_blank',
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ShareOnSocialMedia.propTypes = {
  containerStyle: PropTypes.object,
};

export default ShareOnSocialMedia;

// Resources:
// https://developers.facebook.com/docs/facebook-login/web
// https://developers.facebook.com/docs/sharing/reference/share-dialog
// https://developers.facebook.com/docs/sharing/reference/feed-dialog
// https://developers.facebook.com/docs/javascript/quickstart

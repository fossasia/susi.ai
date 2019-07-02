import React from 'react';
import PropTypes from 'prop-types';
import SettingsTabWrapper from './SettingsTabWrapper';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Translate from '../Translate/Translate.react';
import urls from '../../utils/urls';
import { withStyles } from '@material-ui/core/styles';
import { TabHeading } from './SettingStyles';

const styles = {
  buttonStyle: {
    marginTop: '10px',
    marginBottom: '0px',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  raisedButtonStyle: {
    margin: 20,
    width: '240px',
  },
};

const classes = () => ({
  twitter: {
    backgroundColor: '#00aced',
    '&:hover': {
      backgroundColor: '#009CD5',
    },
  },
  linkedin: {
    backgroundColor: '#0077B5',
    '&:hover': {
      backgroundColor: '#006AA2',
    },
    facebook: {
      backgroundColor: '#3B5998',
      '&:hover': {
        backgroundColor: '#354F88',
      },
    },
  },
});

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
  const { raisedButtonStyle } = styles;
  const { classes } = props;
  return (
    <SettingsTabWrapper heading="">
      <div>
        <div>
          <TabHeading>
            <Translate text="Share about SUSI on Facebook" />
          </TabHeading>
          <Button
            color="primary"
            className={classes.facebook}
            onClick={shareToFacebook}
            variant="contained"
            style={raisedButtonStyle}
          >
            <Icon
              style={{ marginRight: '0.6rem' }}
              className="fa fa-facebook"
            />
            <Translate text="Share on Facebook" />
          </Button>
          <TabHeading>
            <Translate text="Share about SUSI on Twitter" />
          </TabHeading>
          <Button
            color="primary"
            className={classes.twitter}
            onClick={() =>
              window.open(
                'https://twitter.com/intent/tweet?text=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai_',
                '_blank',
              )
            }
            variant="contained"
            style={raisedButtonStyle}
          >
            <Icon style={{ marginRight: '0.6rem' }} className="fa fa-twitter" />
            <Translate text="Share on Twitter" />
          </Button>
          <TabHeading>
            <Translate text="Share about SUSI on LinkedIn" />
          </TabHeading>
          <Button
            color="primary"
            className={classes.linkedin}
            onClick={() =>
              window.open(
                'http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fchat.susi.ai&title=Let%27s%20chat%20with%20SUSI,%20the%20Open%20Source%20personal%20assistant!%0Ahttps%3A%2F%2Fsusi.ai.%20It%27s%20awesome%20%23susiai!%0A@susiai&source=chat.susi.ai',
                '_blank',
              )
            }
            variant="contained"
            style={raisedButtonStyle}
          >
            <Icon
              style={{ marginRight: '0.6rem' }}
              className="fa fa-linkedin"
            />
            <Translate text="Share on Linkedin" />
          </Button>
        </div>
      </div>
    </SettingsTabWrapper>
  );
};

ShareOnSocialMedia.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(classes)(ShareOnSocialMedia);

// Resources:
// https://developers.facebook.com/docs/facebook-login/web
// https://developers.facebook.com/docs/sharing/reference/share-dialog
// https://developers.facebook.com/docs/sharing/reference/feed-dialog
// https://developers.facebook.com/docs/javascript/quickstart

import Dialog from 'material-ui/Dialog';
import React from 'react';
import PropTypes from 'prop-types';
import { ShareButtons, generateShareIcon } from 'react-share';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
import Close from 'material-ui/svg-icons/navigation/close';
const DialogSection = props => {
  const shareUrl = 'http://chat.susi.ai';
  const title =
    'Susi is an artificial intelligence system, combining pattern matching, internet data, data flow-, and inference engine principles. Through some abilities to reflect, it can remember the user input to produce deductions and personalized feedback. Its purpose is to explore the abilities of an artificial companion and to answer the remaining unanswered questions. The SUSI.AI web chat is a front-end developed for web access of SUSI.';
  const ShowParent = {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '8px',
  };
  const IconStyle = {
    height: '48px',
    lineHeight: '48px',
    verticalAlign: 'center',
    marginLeft: '32px',
  };
  const IconParent = {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'flex-start',
  };
  const closingStyle = {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  };
  return (
    <div>
      {/* Share */}
      <Dialog
        contentStyle={{
          width: '350px',
          minWidth: '350px',
          textAlign: 'center',
        }}
        open={props.openShare}
        onRequestClose={props.handleShareClose}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h3>Share about SUSI</h3>
          <div style={{ flex: 1 }} />
          <IconButton onTouchTap={props.handleShareClose}>
            <CloseIcon size={32} />
          </IconButton>
        </div>
        <div style={ShowParent}>
          <div style={IconParent}>
            <FacebookShareButton url={shareUrl} quote={title}>
              <div>
                <FacebookIcon size={42} />
              </div>
            </FacebookShareButton>
            <div style={IconStyle}>Facebook</div>
          </div>
          <div style={IconParent}>
            <TwitterShareButton className="fb-ic" url={shareUrl} title={title}>
              <div>
                <TwitterIcon size={42} />
              </div>
            </TwitterShareButton>
            <div style={IconStyle}>Twitter</div>
          </div>
        </div>
      </Dialog>
      <Dialog
        className="dialogStyle"
        contentStyle={{
          width: '45%',
          minWidth: '300px',
          textAlign: 'center',
        }}
        title="Welcome to SUSI.AI Web Chat"
        open={props.tour}
      >
        <iframe
          width="99%"
          height="315"
          src="https://www.youtube.com/embed/9T3iMoAUKYA"
          frameBorder="0"
          scrolling="no"
        />
        <Close style={closingStyle} onTouchTap={props.onRequestCloseTour()} />
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  tour: PropTypes.bool,
  openShare: PropTypes.bool,
  handleShareClose: PropTypes.func,
  handleShare: PropTypes.func,
  onRequestCloseTour: PropTypes.func,
};

export default DialogSection;

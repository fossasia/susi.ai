import React from 'react';
import PropTypes from 'prop-types';
import { ShareButtons, generateShareIcon } from 'react-share';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
import Close from 'material-ui/svg-icons/navigation/close';
import Dialog from 'material-ui/Dialog';

const styles = {
  shareIconContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconTitleStyle: {
    height: '48px',
    lineHeight: '48px',
    verticalAlign: 'center',
    padding: '0 0 0 5px',
  },
  iconWrapperStyle: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  closingStyle: {
    position: 'absolute',
    zIndex: 1200,
    fill: '#444',
    width: '26px',
    height: '26px',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
  },
  contentStyle: {
    width: '350px',
    minWidth: '350px',
    textAlign: 'center',
  },
  titleWrapperStyle: {
    display: 'flex',
    alignItems: 'center',
  },
};

const DialogSection = props => {
  const shareUrl = 'http://chat.susi.ai';
  const title =
    'Susi is an artificial intelligence system, combining pattern matching, internet data, data flow-, and inference engine principles. Through some abilities to reflect, it can remember the user input to produce deductions and personalized feedback. Its purpose is to explore the abilities of an artificial companion and to answer the remaining unanswered questions. The SUSI.AI web chat is a front-end developed for web access of SUSI.';
  const { isShareOpen, tour, onRequestCloseTour, toggleShareClose } = props;
  const {
    contentStyle,
    titleWrapperStyle,
    shareIconContainer,
    iconWrapperStyle,
    iconTitleStyle,
    closingStyle,
  } = styles;
  return (
    <div>
      {/* Share */}
      <Dialog
        contentStyle={contentStyle}
        open={isShareOpen}
        onRequestClose={toggleShareClose}
      >
        <div style={titleWrapperStyle}>
          <h3>Share about SUSI</h3>
          <div style={{ flex: 1 }} />
          <IconButton onTouchTap={toggleShareClose}>
            <CloseIcon size={32} />
          </IconButton>
        </div>
        <div style={shareIconContainer}>
          <div className="HoverIcon">
            <FacebookShareButton
              url={shareUrl}
              quote={title}
              style={iconWrapperStyle}
            >
              <div>
                <FacebookIcon size={42} />
              </div>
              <div style={iconTitleStyle}>Facebook</div>
            </FacebookShareButton>
          </div>
          <div className="HoverIcon">
            <TwitterShareButton
              style={iconWrapperStyle}
              url={shareUrl}
              title={title}
            >
              <div>
                <TwitterIcon size={42} />
              </div>

              <div style={iconTitleStyle}>Twitter</div>
            </TwitterShareButton>
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
        open={tour}
      >
        <iframe
          width="99%"
          height="315"
          src="https://www.youtube.com/embed/9T3iMoAUKYA"
          frameBorder="0"
          scrolling="no"
        />
        <Close style={closingStyle} onTouchTap={onRequestCloseTour} />
      </Dialog>
    </div>
  );
};

DialogSection.propTypes = {
  tour: PropTypes.bool,
  isShareOpen: PropTypes.bool,
  toggleShareClose: PropTypes.func,
  onRequestCloseTour: PropTypes.func,
};

export default DialogSection;

import React from 'react';
import PropTypes from 'prop-types';
import { ShareButtons, generateShareIcon } from 'react-share';
const {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const LinkedinIcon = generateShareIcon('linkedin');
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogContainer } from '../../Commons/Container';

const styles = {
  shareIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0.7rem 2.5rem',
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
  titleWrapperStyle: {
    textAlign: 'center',
  },
};

const DialogSection = props => {
  const shareUrl = 'http://chat.susi.ai';
  const title =
    'Susi is an artificial intelligence system, combining pattern matching, internet data, data flow-, and inference engine principles. Through some abilities to reflect, it can remember the user input to produce deductions and personalized feedback. Its purpose is to explore the abilities of an artificial companion and to answer the remaining unanswered questions. The SUSI.AI web chat is a front-end developed for web access of SUSI.';
  const { isShareOpen, tour, onRequestCloseTour, toggleShareClose } = props;
  const {
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
        maxWidth={'xs'}
        fullWidth={true}
        open={isShareOpen}
        onClose={toggleShareClose}
      >
        <div style={titleWrapperStyle}>
          <h3>Share about SUSI</h3>
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
          <div className="HoverIcon">
            <LinkedinShareButton
              style={iconWrapperStyle}
              url={shareUrl}
              title={title}
            >
              <div>
                <LinkedinIcon size={42} />
              </div>

              <div style={iconTitleStyle}>LinkedIn</div>
            </LinkedinShareButton>
          </div>
        </div>
        <Close style={closingStyle} onClick={toggleShareClose} />
      </Dialog>
      <Dialog fullWidth={true} maxWidth={'sm'} open={tour}>
        <DialogContainer>
          <DialogTitle>Welcome to SUSI.AI Web Chat</DialogTitle>
          <iframe
            width="99%"
            height="315"
            src="https://www.youtube.com/embed/9T3iMoAUKYA"
            frameBorder="0"
            scrolling="no"
          />
          <Close style={closingStyle} onClick={onRequestCloseTour} />
        </DialogContainer>
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

import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseButton from '../shared/CloseButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uiActions from '../../redux/actions/ui';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import _IconButton from '@material-ui/core/IconButton';

const styles = {
  iconWrapperStyle: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
};

const shareUrl = 'http://chat.susi.ai';
const title =
  'Susi is an artificial intelligence system, combining pattern matching, internet data, data flow-, and inference engine principles. Through some abilities to reflect, it can remember the user input to produce deductions and personalized feedback. Its purpose is to explore the abilities of an artificial companion and to answer the remaining unanswered questions. The SUSI.AI web chat is a front-end developed for web access of SUSI.';

const ShareIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.7rem 2.5rem;
`;

const TextContainer = styled.div`
  height: 48px;
  line-height: 48px;
  verticalalign: center;
  padding-left: 0.5rem;
`;

const IconButton = styled(_IconButton)`
  border-radius: 2px;
  padding: 0.5rem;
  font-size: 1rem;
`;

const Share = ({ actions }) => {
  const { iconWrapperStyle } = styles;
  return (
    <React.Fragment>
      <DialogTitle>Share about SUSI</DialogTitle>
      <ShareIconContainer>
        <IconButton>
          <FacebookShareButton
            url={shareUrl}
            quote={title}
            style={iconWrapperStyle}
          >
            <div>
              <FacebookIcon size={42} />
            </div>
            <TextContainer>Facebook</TextContainer>
          </FacebookShareButton>
        </IconButton>
        <IconButton>
          <TwitterShareButton
            style={iconWrapperStyle}
            url={shareUrl}
            title={title}
          >
            <div>
              <TwitterIcon size={42} />
            </div>
            <TextContainer>Twitter</TextContainer>
          </TwitterShareButton>
        </IconButton>
        <IconButton>
          <LinkedinShareButton
            style={iconWrapperStyle}
            url={shareUrl}
            title={title}
          >
            <div>
              <LinkedinIcon size={42} />
            </div>
            <TextContainer>LinkedIn</TextContainer>
          </LinkedinShareButton>
        </IconButton>
      </ShareIconContainer>
      <CloseButton onClick={actions.closeModal} />
    </React.Fragment>
  );
};

Share.propTypes = {
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Share);

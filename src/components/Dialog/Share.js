import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseButton from '../shared/CloseButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import uiActions from '../../redux/actions/ui';
import {
  FacebookShareButton as _FacebookShareButton,
  LinkedinShareButton as _LinkedinShareButton,
  TwitterShareButton as _TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';
import _IconButton from '@material-ui/core/IconButton';

const shareUrl = 'https://susi.ai';

const commonIconStyle = css`
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

const ShareIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.7rem 2.5rem;
`;

const TextContainer = styled.div`
  height: 3rem;
  line-height: 3rem;
  verticalalign: center;
  padding-left: 0.5rem;
`;

const IconButton = styled(_IconButton)`
  border-radius: 0.125rem;
  padding: 0.5rem;
  font-size: 1rem;
`;

const FacebookShareButton = styled(_FacebookShareButton)`
  ${commonIconStyle};
`;

const LinkedinShareButton = styled(_LinkedinShareButton)`
  ${commonIconStyle};
`;

const TwitterShareButton = styled(_TwitterShareButton)`
  ${commonIconStyle};
`;

const Share = ({ actions, message }) => {
  const title = message;
  return (
    <React.Fragment>
      <DialogTitle>Share about SUSI</DialogTitle>
      <ShareIconContainer>
        <IconButton>
          <FacebookShareButton url={shareUrl} quote={title}>
            <div>
              <FacebookIcon size={42} />
            </div>
            <TextContainer>Facebook</TextContainer>
          </FacebookShareButton>
        </IconButton>
        <IconButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <div>
              <TwitterIcon size={42} />
            </div>
            <TextContainer>Twitter</TextContainer>
          </TwitterShareButton>
        </IconButton>
        <IconButton>
          <LinkedinShareButton url={shareUrl} title={title}>
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
  message: PropTypes.string,
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

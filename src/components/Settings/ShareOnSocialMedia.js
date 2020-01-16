import React, { Component } from 'react';
import _IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  FacebookShareButton as _FacebookShareButton,
  LinkedinShareButton as _LinkedinShareButton,
  TwitterShareButton as _TwitterShareButton,
  WhatsappShareButton as _WhatsappShareButton,
  TelegramShareButton as _TelegramShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
import styled, { css } from 'styled-components';
import CopyWithButton from '../../utils/CopyWithButton';
import PropTypes from 'prop-types';
import urls from '../../utils/urls';

const commonIconStyle = css`
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  width: 100%;
  outline: none;
`;

const ShareIconContainer = styled.div`
  display: flex;
  margin: 0.7rem 2.5rem;
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

const WhatsappShareButton = styled(_WhatsappShareButton)`
  ${commonIconStyle};
`;

const TelegramShareButton = styled(_TelegramShareButton)`
  ${commonIconStyle};
`;

const defaultShareTitle =
  'Lets chat with SUSI.AI, the open source personal assistant';

const shareUrl = urls.CHAT_URL;

class ShareOnSocialMedia extends Component {
  state = {
    shareUrl,
    title: this.props.title || defaultShareTitle,
    shareText: defaultShareTitle + ' ' + shareUrl,
  };

  handleChange = event => this.setState({ shareText: event.target.value });

  render() {
    return (
      <React.Fragment>
        <DialogTitle>Share about SUSI.AI</DialogTitle>

        <CopyWithButton
          value={this.state.shareText}
          width={this.props.width}
          handleChange={this.handleChange}
        />
        <ShareIconContainer>
          <IconButton>
            <FacebookShareButton
              url={this.state.shareUrl}
              quote={this.state.title}
            >
              <div>
                <FacebookIcon size={42} />
              </div>
            </FacebookShareButton>
          </IconButton>
          <IconButton>
            <TwitterShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <div>
                <TwitterIcon size={42} />
              </div>
            </TwitterShareButton>
          </IconButton>
          <IconButton>
            <LinkedinShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <div>
                <LinkedinIcon size={42} />
              </div>
            </LinkedinShareButton>
          </IconButton>
          <IconButton>
            <WhatsappShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <div>
                <WhatsappIcon size={42} />
              </div>
            </WhatsappShareButton>
          </IconButton>
          <IconButton>
            <TelegramShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <div>
                <TelegramIcon size={42} />
              </div>
            </TelegramShareButton>
          </IconButton>
        </ShareIconContainer>
      </React.Fragment>
    );
  }
}

ShareOnSocialMedia.propTypes = {
  title: PropTypes.string,
  width: PropTypes.any,
};

export default ShareOnSocialMedia;

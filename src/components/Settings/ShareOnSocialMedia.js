import React from 'react';
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

const ShareOnSocialMedia = () => {
  const shareUrl = 'https://susi.ai';
  const title = 'Lets chat with SUSI.AI, the open source personal assistant';
  const shareText =
    'Lets chat with SUSI.AI, the open source personal assistant https://susi.ai';

  return (
    <React.Fragment>
      <DialogTitle>Share about SUSI</DialogTitle>

      <CopyWithButton value={shareText} />
      <ShareIconContainer>
        <IconButton>
          <FacebookShareButton url={shareUrl} quote={title}>
            <div>
              <FacebookIcon size={42} />
            </div>
          </FacebookShareButton>
        </IconButton>
        <IconButton>
          <TwitterShareButton url={shareUrl} title={title}>
            <div>
              <TwitterIcon size={42} />
            </div>
          </TwitterShareButton>
        </IconButton>
        <IconButton>
          <LinkedinShareButton url={shareUrl} title={title}>
            <div>
              <LinkedinIcon size={42} />
            </div>
          </LinkedinShareButton>
        </IconButton>
        <IconButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <div>
              <WhatsappIcon size={42} />
            </div>
          </WhatsappShareButton>
        </IconButton>
        <IconButton>
          <TelegramShareButton url={shareUrl} title={title}>
            <div>
              <TelegramIcon size={42} />
            </div>
          </TelegramShareButton>
        </IconButton>
      </ShareIconContainer>
    </React.Fragment>
  );
};

export default ShareOnSocialMedia;

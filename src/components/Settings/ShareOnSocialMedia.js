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

const commonIconStyle = css`
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
  width: 100%;
  outline: none;
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

const WhatsappShareButton = styled(_WhatsappShareButton)`
  ${commonIconStyle};
`;

const TelegramShareButton = styled(_TelegramShareButton)`
  ${commonIconStyle};
`;

const ShareOnSocialMedia = () => {
  const shareUrl = 'https://susi.ai';
  const title = 'Lets chat with SUSI.AI, the open source personal assistant';
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
        <IconButton>
          <WhatsappShareButton url={shareUrl} title={title}>
            <div>
              <WhatsappIcon size={42} />
            </div>
            <TextContainer>Whatsapp</TextContainer>
          </WhatsappShareButton>
        </IconButton>
        <IconButton>
          <TelegramShareButton url={shareUrl} title={title}>
            <div>
              <TelegramIcon size={42} />
            </div>
            <TextContainer>Telegram</TextContainer>
          </TelegramShareButton>
        </IconButton>
      </ShareIconContainer>
    </React.Fragment>
  );
};

export default ShareOnSocialMedia;

import styled, { css, keyframes } from 'styled-components';

const SUSIKeyframe = keyframes`
  from {
    opacity: 0.6;
    transform: translate3d(0, 0.3125rem, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const UserKeyframe = keyframes`
  from {
    opacity: 0.6;
    transform: translate3d(0, 0.3125rem, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const MessageWrapper = styled.section`
  position: relative;
  min-width: 5rem;
  max-width: 80%;
  ${props => props.width} ${props =>
    props.width &&
    css`
      width: ${props => props.width};
    `}
  font-weight: 300;
  vertical-align: middle;
  line-height: 1.375rem;
  padding: 0.1rem 0.8rem;
  margin: 0.25rem;
  border-radius: 0.5rem;
  margin-left: auto;
  margin-right: 0.75rem;
  border-radius: 0.875rem;
  font-family: 'Product Sans', sans-serif;
  animation-iteration-count: 1;
  ${props =>
    props.author === 'SUSI'
      ? css`
          animation: ${SUSIKeyframe} 700ms ease-out;
          margin-left: 0.75rem;
          margin-right: 0.42rem;
          background: #f3f2f4;
        `
      : css`
          animation: ${UserKeyframe} 700ms ease;
          color: white;
          background: #4285f4;
        `};
  &::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    left: 100%;
    top: 2.5rem;
    transform: rotate(-135deg);
    ${props =>
      props.author === 'SUSI' &&
      css`
        transform: rotate(-315deg);
        left: 0;
        top: 1rem;
        border-color: transparent transparent #fff #fff;
        background: #fff;
      `};
  }
  &::before {
    content: '';
    width: 0px;
    height: 0px;
    top: 0px;
    position: absolute;
    ${props =>
      props.author === 'SUSI'
        ? css`
            left: -0.5625rem;
            border-left: 1rem solid transparent;
            border-right: 0.3rem solid #f3f2f4;
            border-top: 1.5rem solid #f3f2f4;
          `
        : css`
            border-left: 0.3rem solid #4285f4;
            border-right: 1rem solid transparent;
            border-top: 1.5rem solid #4285f4;
            right: -0.5625rem;
          `};
  }
`;

export default MessageWrapper;

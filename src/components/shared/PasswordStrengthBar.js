import styled, { css } from 'styled-components';

const PasswordStrengthBar = styled.div`
  height: 2px;
  transition: width 300ms ease-out;
  margin: 0 auto;
${props =>
  props.score === -1 &&
  css`
    display: none;
  `}
  ${props =>
    props.score === (0 || 1) &&
    css`
      background: #d1462f;
      width: 4rem;
    `}
  ${props =>
    props.score === 2 &&
    css`
      background: #57b8ff;
      width: 8rem;
    `}
  ${props =>
    props.score === 3 &&
    css`
      background: #57b8ff;
      width: 12rem;
    `}
  ${props =>
    props.score === 4 &&
    css`
      background: #2fbf71;
      width: 16rem;
    `}
}
`;

export default PasswordStrengthBar;

import styled, { css } from 'styled-components';
import _PasswordField from 'material-ui-password-field';
import _OutlinedInput from '@material-ui/core/OutlinedInput';
import _Button from '@material-ui/core/Button';

export const breakPointStyle = css`
  @media (max-width: 442px) {
    width: 100%;
  }
`;

export const responsiveInputStyle = css`
  width: 17rem;
  height: 2.1rem;
  ${breakPointStyle};
`;

export const PasswordField = styled(_PasswordField)`
  ${responsiveInputStyle};
  border-radius: 4px;
  border: 1px solid #ced4da;
  padding: 0px 0.625rem;
  margin-top: 0.625rem;
`;

export const OutlinedInput = styled(_OutlinedInput)`
  ${responsiveInputStyle};
  ${props =>
    props.width &&
    css`
      width: ${props => props.width};
    `}
`;

export const Button = styled(_Button)`
  width: 17rem;
  margin: 0.625rem auto;
  ${breakPointStyle};
`;

export const StyledLink = styled.span`
  color: #365899;
  cursor: pointer;
  font-size: 0.75rem;
  :hover {
    color: #365899;
    text-decoration: underline;
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 0 1.25rem;
  margin-top: 0.625rem;
`;

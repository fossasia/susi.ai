import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import _OutlinedInput from '@material-ui/core/OutlinedInput';
import _InputAdornment from '@material-ui/core/InputAdornment';
import _IconButton from '@material-ui/core/IconButton';
import _Visibility from '@material-ui/icons/Visibility';
import _VisibilityOff from '@material-ui/icons/VisibilityOff';
import _Button from '@material-ui/core/Button';
import _FormControl from '@material-ui/core/FormControl';

export const breakPointStyle = css`
  @media (max-width: 442px) {
    width: 100%;
  }
`;

export const responsiveInputStyle = css`
  margin: auto;
  width: 17rem;
  height: 2.1rem;
  ${breakPointStyle};
`;

export const FormControl = styled(_FormControl)`
  width: 100%;
  display: flex;
  align-items: center;
`;

const PasswordFieldBase = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <_OutlinedInput
      {...props}
      className={className}
      type={showPassword ? 'text' : 'password'}
      labelWidth={0}
      endAdornment={
        <_InputAdornment position="end">
          <_IconButton
            edge="end"
            onClick={() => setShowPassword((prev) => !prev)}
            onMouseDown={(event) => event.preventDefault()}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <_VisibilityOff /> : <_Visibility />}
          </_IconButton>
        </_InputAdornment>
      }
    />
  );
};

export const PasswordField = styled(PasswordFieldBase)`
  ${responsiveInputStyle};
  border-radius: 4px;
  border: 1px solid #ced4da;
  padding: 0px 0.625rem;
  margin-top: 0.625rem;
`;

export const OutlinedInput = styled(_OutlinedInput)`
  ${responsiveInputStyle};
  ${(props) =>
    props.width &&
    css`
      width: ${(props) => props.width};
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

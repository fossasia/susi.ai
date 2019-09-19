import styled, { css } from 'styled-components';

export const TabHeading = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const Divider = styled.hr`
  margin: 0px;
  width: 100%;
  height: 1px;
  border: 0 none;
  background-color: ${props =>
    props.theme === 'light' ? '#f2f2f2' : '#ffffff'};
  ${props =>
    props.marginTop &&
    css`
      margin-top: ${props => props.marginTop};
    `};
`;

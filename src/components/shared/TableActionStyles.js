import styled, { css } from 'styled-components';

const commonActionStyle = css`
  cursor: pointer;
  color: #49a9ee;
`;

export const ActionSpan = styled.span`
  ${commonActionStyle};
  @media (max-width: 1340px) {
    margin-right: 0.2rem;
  }
`;

export const ActionDiv = styled.div`
  ${commonActionStyle};
`;

export const ActionSeparator = styled.span`
  margin-left: 0.313rem;
  margin-right: 0.313rem;
  @media (max-width: 1340px) {
    display: none;
  }
`;

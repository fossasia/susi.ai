import styled, { css } from 'styled-components';

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DialogContainer = styled.div`
  ${props =>
    props.padding &&
    css`
      padding: 1rem 1.5rem;
      text-align: center;
      @media (max-width: 460px) {
        padding: 0.3rem;
      }
    `};
`;

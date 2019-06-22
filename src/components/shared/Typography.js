import styled from 'styled-components';

export const Title = styled.h1`
  padding-bottom: 1rem;
  margin: ${props => (props.marginTop ? '20px' : '0px')};
`;

export const SubTitle = styled.p`
  font-weight: normal;
  font-size: ${props => (props.size ? props.size : '1.5rem')}
  padding-bottom: 0.5rem;
`;

export const DefaultMessage = styled.div`
  margin: 0.625rem;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
`;

export const LargeText = styled.div`
  font-size: 3rem;
`;

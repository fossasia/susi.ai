import _Paper from '@material-ui/core/Paper';
import styled from 'styled-components';

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DialogContainer = styled.div`
  padding: ${props =>
    props.style.padding ? props.style.padding : '1rem 1.5rem'};
  text-align: ${props =>
    props.style.textAlign ? props.style.textAlign : 'center'};
  @media (max-width: 460px) {
    padding: ${props => (props.style.padding ? props.style.padding : '0.3rem')};
  }
`;

export const Paper = styled(_Paper)`
  margin: ${props => (props.margin ? props.margin + 'rem' : '1rem')} 0;
  padding: 1rem;
`;

export const CenterReaderContainer = styled.div`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1%;
  padding-right: 1%;
  width: 80%;
  @media (max-width: 1240px) {
    padding: 25px 32px;
    width: 100%;
  }
`;

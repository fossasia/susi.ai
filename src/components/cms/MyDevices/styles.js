import styled from 'styled-components';
import _Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

export const Paper = styled(_Paper)`
  width: 100%;
  margin-bottom: 1.25rem;
  padding: 1rem 2.25rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

export const Container = styled.div`
  padding: 4rem 4rem 2rem;
  @media (max-width: 480px) {
    padding: 4rem 1rem 2rem;
  }
`;

export const CustomButton = styled(Button)`
  margin-left: 35px;
  margin-bottom: 10px;
  display: block;
`;

export const Bold = styled.b`
  font-size: 16px;
`;

export const SpeechToTextDiv = styled.div`
  padding: 10px 0px;
`;

export const SaveButton = styled(Button)`
  display: block;
  margin-bottom: 10px;
`;

export const ErrorText = styled.div`
  font-size: 40px;
  text-align: center;
  top: 40%;
  position: absolute;
  width: 100%;
  padding: 0px 20px;

  @media (max-width: 600px) {
    font-size: 30px;
    padding: 0px 20px;
  }
`;

export const OverlayContainer = styled(Paper)`
  position: relative;
`;

export const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.7);
  height: 100%;
  width: 100%;
  opacity: 0;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0;
  transition: opacity 0.5s;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 100;
  font-size: 1.5rem;

  :hover {
    opacity: 0.9;
    transition: opacity 0.5s;
  }
`;

export const ControlHeading = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  margin: 1rem 0;
`;

export const Section = styled.div`
  margin-top: 2rem;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

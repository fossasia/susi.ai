import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';

export const HeadingContainer = styled.div`
  display: flex;
  text-align: center;
  padding: 0 2rem;
  background: #fff;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

export const StyledPaper = styled(Paper)`
  background-color: #f5f5f5;
  padding-bottom: 2rem;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);

  @media (max-width: 480px) {
    padding-bottom: 1rem;
  }
`;

export const Heading = styled.h1`
  line-height: 2rem;
`;

export const Container = styled(Paper)`
  padding: 1.25rem;
  margin: 1.25rem 2rem;

  @media (max-width: 480px) {
    margin: 1.25rem 1rem;
  }
`;

export const EditorContainer = styled.div`
  margin: 1.25rem 2rem;

  @media (max-width: 480px) {
    margin: 1.25rem 1rem;
  }
`;

export const IconButtonContainer = styled.div`
  margin-left: auto;
  margin-right: 0px;
`;

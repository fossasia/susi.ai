import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const StyledIconButton = styled(IconButton)`
  border-radius: 2px;
  padding: 0.5rem;
`;

export const UserDetail = styled.label`
  color: white;
  margin-right: 5px;
  font-size: 1rem;
  cursor: pointer;
  @media (max-width: 1000px) {
    display: None;
  }
`;

export const SusiLogo = styled.img`
  height: 1.5rem;
  display: block;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

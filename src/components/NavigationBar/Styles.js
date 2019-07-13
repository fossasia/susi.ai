import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const StyledIconButton = styled(IconButton)`
  border-radius: 2px;
  padding: ${props => (props.padding ? props.padding : '0.2rem 0.5rem')};
`;

export const OutlinedSelectStyles = css`
  background-color: #f3f3f3;
  height: 35px;
  :hover {
    background-color: #dadada;
    border-color: rgba(117, 117, 117, 0.23);
  }
  &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #dadada;
  }
`;

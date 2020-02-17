import { Link as _Link } from 'react-router-dom';
import styled from 'styled-components';

// Plain Link component

const Link = styled(_Link)`
  color: ${props => (props.colorize ? 'rgb(66, 133, 244)' : '#000')};
  text-decoration: none;
  &:hover {
    color: #000;
  }
`;

export default Link;

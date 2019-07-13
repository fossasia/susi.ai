import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

const Popper = styled(ReactTooltip)`
  pointer-events: auto;
  padding: 0px;
  border: 0px;
  margin-left: -2rem;
  &:hover {
    visibility: visible;
    opacity: 1;
  }
  :before,
  :after {
    display: none;
  }
  &.place-bottom {
    margin-top: 5px;
  }
`;

export default Popper;

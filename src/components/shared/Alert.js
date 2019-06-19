import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import _CancelIcon from '@material-ui/icons/Cancel';
import _TickIcon from '@material-ui/icons/CheckCircle';

const common = css`
  position: absolute;
  left: 5rem;
  @media (max-width: 500px) {
    left: 3rem;
  }
`;

const Container = styled.div`
  padding: 1rem 1rem 1rem 4rem;
  background-color: ${props =>
    props.type === 'error' ? '#fff1f0' : '#f6ffed'};
  border: 1px solid ${props => (props.type === 'error' ? '#ffa39e' : '#b7eb8f')};
  font-size: 1.25rem;
  line-height: 2;
  overflow-wrap: break-word;
  border-radius: 0.3rem;
`;

const CancelIcon = styled(_CancelIcon)`
  ${common};
  fill: #f04134;
`;

const TickIcon = styled(_TickIcon)`
  ${common};
  fill: #52c41a;
`;

const Alert = ({ type, description }) => {
  return (
    <Container type={type}>
      {type === 'error' ? <CancelIcon /> : <TickIcon />}
      {description}
    </Container>
  );
};

Alert.propTypes = {
  type: PropTypes.string,
  description: PropTypes.string,
  left: PropTypes.string,
};

export default Alert;

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CancelIcon from '@material-ui/icons/Cancel';
import TickIcon from '@material-ui/icons/CheckCircle';

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

const Alert = ({ type, description }) => {
  return (
    <Container type={type}>
      {type === 'error' ? (
        <CancelIcon
          style={{ position: 'absolute', left: '5rem', fill: '#f04134' }}
        />
      ) : (
        <TickIcon
          style={{ position: 'absolute', left: '5rem', fill: '#52c41a' }}
        />
      )}
      {description}
    </Container>
  );
};

Alert.propTypes = {
  type: PropTypes.string,
  description: PropTypes.string,
};

export default Alert;

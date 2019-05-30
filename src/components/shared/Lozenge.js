import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Box = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.color};
  border-radius: 4px;
  text-align: center;
  margin: 0 auto;
`;

const Lozenge = ({ text, color }) => {
  return (
    <Box color={color}>
      <p style={{ color: '#fff' }}>{text}</p>
    </Box>
  );
};

Lozenge.propTypes = {
  text: PropTypes.number,
  color: PropTypes.string,
};

export default Lozenge;

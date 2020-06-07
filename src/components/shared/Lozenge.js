import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Box = styled.div`
  height: 40px;
  width: auto;
  max-width: fit-content;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  text-align: center;
  margin: 0 auto;
`;

const Text = styled.p`
  color: #fff;
  padding: 0px 10px;
`;

const Lozenge = ({ text, color }) => {
  return (
    <Box color={color}>
      <Text>{text}</Text>
    </Box>
  );
};

Lozenge.propTypes = {
  text: PropTypes.number,
  color: PropTypes.string,
};

export default Lozenge;

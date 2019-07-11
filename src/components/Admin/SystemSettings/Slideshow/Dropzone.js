import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  border: 2px dashed #4285f4;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 300px;
  font-size: 1.3rem;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 1rem;
  ${props =>
    props.disabled === true &&
    css`
      cursor: not-allowed;
      pointer-event: none;
      border: 2px dashed rgba(0, 0, 0, 0.38);
      color: rgba(0, 0, 0, 0.38);
    `}
`;

const SlideshowImage = styled.img`
  width: 600px;
  height: 200px;
`;

const Dropzone = ({ handleFilePreview, src, isSliderImageAdded, disabled }) => {
  return (
    <Container onClick={handleFilePreview} disabled={disabled}>
      {isSliderImageAdded && (
        <div>
          <SlideshowImage src={src} />
        </div>
      )}
      <div>
        <p>Drop image file</p>
        <p>or</p>
        <p>Click to upload</p>
      </div>
    </Container>
  );
};

Dropzone.propTypes = {
  handleFilePreview: PropTypes.func,
  isSliderImageAdded: PropTypes.bool,
  disabled: PropTypes.bool,
  src: PropTypes.string,
};

export default Dropzone;

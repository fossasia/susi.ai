import React from 'react';
import styled from 'styled-components';
import ColorPicker from 'material-ui-color-picker';
import PropTypes from 'prop-types';

const ColorBox = styled.span`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 3px;
  border: 1px solid #0000006e;
  cursor: pointer;
  margin-right: 0.625rem;
  margin-bottom: -0.5rem;
  background-color: ${props => props.backgroundColor};
`;

const ColorPickerContainer = styled.div`
  margin-left: 2.8rem;
  margin-top: -1.8rem;
  width: 6rem;
`;

const ColorPickerComponent = props => {
  const {
    backgroundColor,
    handleClickColorBox,
    id,
    handleChangeColor,
    component,
  } = props;
  return (
    <div>
      <ColorBox
        backgroundColor={backgroundColor}
        onClick={() => handleClickColorBox(id)}
      />
      <ColorPickerContainer>
        <ColorPicker
          name="color"
          id={'colorPicker' + id}
          defaultValue={backgroundColor}
          onChange={color => handleChangeColor(component, color)}
        />
      </ColorPickerContainer>
    </div>
  );
};

ColorPickerComponent.propTypes = {
  backgroundColor: PropTypes.string,
  handleClickColorBox: PropTypes.func,
  id: PropTypes.number,
  component: PropTypes.string,
  handleChangeColor: PropTypes.func,
};

export default ColorPickerComponent;

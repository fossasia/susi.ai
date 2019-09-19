import React from 'react';
import _AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/tomorrow';
import 'brace/theme/kuroir';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import 'brace/mode/java';
import 'brace/theme/textmate';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/terminal';
import 'brace/ext/searchbox';

const AceEditor = styled(_AceEditor)`
  resize: vertical;
  min-height: 12.5rem;
  max-height: 35rem;
  border: 1px solid #d1d5da;
  background-color: #fafbfc !important;

  &:focus {
    background-color: #ffffff;
    border-color: #2188ff;
    box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075),
      0 0 0 0.2em rgba(3, 102, 214, 0.3);
  }
`;

const AceEditorComponent = props => {
  const {
    theme = 'github',
    fontSize = 14,
    value: code,
    height = '25rem',
    onChange,
    ...otherProps
  } = props;
  return (
    <AceEditor
      mode="java"
      theme={theme}
      width="100%"
      fontSize={fontSize}
      height={height}
      value={code}
      showPrintMargin={false}
      name="skill_code_editor"
      onChange={onChange}
      scrollPastEnd={false}
      wrapEnabled={true}
      editorProps={{ $blockScrolling: true }}
      {...otherProps}
    />
  );
};

AceEditorComponent.propTypes = {
  theme: PropTypes.string,
  fontSize: PropTypes.number,
  height: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default AceEditorComponent;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _AceEditor from 'react-ace';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
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

const Container = styled.div`
  margin-bottom: 40px;
`;

const AceEditor = styled(_AceEditor)`
  resize: vertical;
  overflow-y: auto;
  min-height: 200px;
  border: 1px solid #d1d5da;
  background-color: #fafbfc !important;

  &:focus {
    background-color: #ffffff;
    border-color: #2188ff;
    box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075),
      0 0 0 0.2em rgba(3, 102, 214, 0.3);
  }
`;

class CodeView extends Component {
  render() {
    const { actions, code } = this.props;
    return (
      <Container>
        <AceEditor
          mode="java"
          theme="github"
          width="100%"
          fontSize={14}
          height="200px"
          value={code}
          onChange={event => actions.setDesignData({ code: event })}
          showPrintMargin={false}
          name="skill_code_editor"
          scrollPastEnd={false}
          wrapEnabled={true}
          editorProps={{ $blockScrolling: true }}
        />
      </Container>
    );
  }
}

CodeView.propTypes = {
  actions: PropTypes.object,
  code: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    code: store.create.design.code,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(createActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CodeView);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
import PropTypes from 'prop-types';
import _AceEditor from 'react-ace';
import styled from 'styled-components';

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
  handleChangeCode = event => {
    const { actions } = this.props;
    actions.setConfigureData({ configCode: event });
  };

  render() {
    const { configCode } = this.props;
    return (
      <div>
        <AceEditor
          mode="java"
          theme="github"
          width="100%"
          fontSize={14}
          height="300px"
          value={configCode}
          onChange={this.handleChangeCode}
          showPrintMargin={false}
          name="skill_code_editor"
          scrollPastEnd={false}
          wrapEnabled={true}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    );
  }
}

CodeView.propTypes = {
  actions: PropTypes.object,
  configCode: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    configCode: store.create.configCode,
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

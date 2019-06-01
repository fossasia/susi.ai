import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

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
          style={{
            resize: 'vertical',
            overflowY: 'auto',
            minHeight: '200px',
          }}
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

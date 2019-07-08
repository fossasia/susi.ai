import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
import PropTypes from 'prop-types';
import AceEditorComponent from '../../../../shared/AceEditor.js';

class CodeView extends Component {
  handleChangeCode = event => {
    const { actions } = this.props;
    actions.setConfigureData({ configCode: event });
  };

  render() {
    const { configCode } = this.props;
    return (
      <div>
        <AceEditorComponent
          value={configCode}
          onChange={this.handleChangeCode}
          height="18.75rem"
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

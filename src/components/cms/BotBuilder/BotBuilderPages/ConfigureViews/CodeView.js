import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
import PropTypes from 'prop-types';
import AceEditorComponent from '../../../../shared/AceEditor.js';

const CodeView = ({ actions, configCode }) => {
  const handleChangeCode = event => {
    actions.setConfigureData({ configCode: event });
  };
  return (
    <div>
      <AceEditorComponent
        value={configCode}
        onChange={handleChangeCode}
        height="18.75rem"
      />
    </div>
  );
};

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

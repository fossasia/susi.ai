import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
import AceEditorComponent from '../../../../shared/AceEditor.js';
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
  margin-bottom: 2.5rem;
`;

class CodeView extends Component {
  render() {
    const { actions, code } = this.props;
    return (
      <Container>
        <AceEditorComponent
          value={code}
          onChange={event => actions.setDesignData({ code: event })}
          height="12.5rem"
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

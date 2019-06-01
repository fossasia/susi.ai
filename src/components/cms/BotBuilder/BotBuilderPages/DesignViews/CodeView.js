import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import createActions from '../../../../../redux/actions/create';
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

class CodeView extends Component {
  render() {
    const { actions, code } = this.props;
    return (
      <div style={{ marginBottom: '40px' }}>
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

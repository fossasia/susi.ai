import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import createActions from '../../../../redux/actions/create';
import styled from 'styled-components';
import AceEditorComponent from '../../../shared/AceEditor';

const CodeEditorDiv = styled.div`
  width: 100%;
  margin-top: 1.25rem;
  padding: 0rem;
`;

class CodeView extends React.Component {
  state = {
    loading: false,
  };

  onChange = newValue => {
    const { actions } = this.props;
    const match = newValue.match(/^::image\s(.*)$/m);
    const nameMatch = newValue.match(/^::name\s(.*)$/m);
    const categoryMatch = newValue.match(/^::category\s(.*)$/m);
    const languageMatch = newValue.match(/^::language\s(.*)$/m);

    const payload = {
      name: nameMatch ? nameMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      language: languageMatch ? languageMatch[1] : '',
      imageUrl: match ? match[1] : '',
      code: newValue,
    };
    actions.setSkillData(payload);
  };

  render() {
    const { code, editable } = this.props;
    const { loading } = this.state;
    return (
      <CodeEditorDiv>
        {loading && <LinearProgress color="primary" />}
        <AceEditorComponent
          value={code}
          onChange={this.onChange}
          readOnly={!editable}
        />
      </CodeEditorDiv>
    );
  }
}

CodeView.propTypes = {
  editable: PropTypes.bool,
  actions: PropTypes.object,
  code: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    code: store.create.skill.code,
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

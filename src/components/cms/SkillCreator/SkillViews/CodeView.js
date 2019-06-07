import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _Icon from 'antd/lib/icon';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import _AceEditor from 'react-ace';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import createActions from '../../../../redux/actions/create';
import styled from 'styled-components';

const fontsizes = [];
const codeEditorThemes = [];

const Icon = styled(_Icon)`
  margin-right: 0.313rem;
`;

const CodeEditorDiv = styled.div`
  width: 100%;
  margin-top: 1.25rem;
`;

const ToolBarDiv = styled.div`
  width: 100%;
  height: 3.125rem;
  background: #fff;
  border-bottom: 0.125rem solid #eee;
  display: none;
  align-items: stretch;
  padding: 0 1.563rem;
  font-size: 0.875rem;
`;

const ButtonSpan = styled.span`
  display: flex;
  margin-right: 1.875rem;
  align-items: center;
  cursor: pointer;
`;

const HomeDiv = styled.div`
  width: 100%;
  padding: 0rem;
`;

const AceEditor = styled(_AceEditor)`
  resize: vertical;
  min-height: 12.5rem;
  max-height: 35rem;
`;

class CodeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      commitMessage: '',
      fontSizeCode: 14,
      editorTheme: 'github',
    };
    let fonts = [14, 16, 18, 20, 24, 28, 32, 40];
    let themes = [
      'monokai',
      'github',
      'tomorrow',
      'kuroir',
      'twilight',
      'xcode',
      'textmate',
      'solarized_dark',
      'solarized_light',
      'terminal',
    ];
    for (let i = 0; i < fonts.length; i++) {
      fontsizes.push(
        <MenuItem value={fonts[i]} key={fonts[i]}>
          {`${fonts[i]}`}
        </MenuItem>,
      );
    }
    for (let i = 0; i < themes.length; i++) {
      codeEditorThemes.push(
        <MenuItem value={themes[i]} key={themes[i]}>
          {`${themes[i]}`}
        </MenuItem>,
      );
    }
  }

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

  handleCommitMessageChange = event => {
    this.setState({
      commitMessage: event.target.value,
    });
  };

  handleFontChange = (event, index, value) => {
    this.setState({
      fontSizeCode: value,
    });
  };

  handleThemeChange = (event, index, value) => {
    this.setState({
      editorTheme: value,
    });
  };

  render() {
    const { code } = this.props;
    return (
      <div>
        <HomeDiv>
          <CodeEditorDiv>
            {this.state.loading && <LinearProgress color="primary" />}
            <ToolBarDiv>
              <ButtonSpan>
                <Icon type="cloud-download" />
                Download as text
              </ButtonSpan>
              <ButtonSpan>
                Size{' '}
                <Select
                  style={{ width: '3.75rem' }}
                  onChange={this.handleFontChange}
                >
                  {fontsizes}
                </Select>
              </ButtonSpan>

              <ButtonSpan>
                Theme{' '}
                <Select
                  style={{ width: '9.375rem' }}
                  onChange={this.handleThemeChange}
                >
                  {codeEditorThemes}
                </Select>
              </ButtonSpan>
            </ToolBarDiv>
            <AceEditor
              mode="java"
              theme={this.state.editorTheme}
              width="100%"
              fontSize={this.state.fontSizeCode}
              height="25rem"
              value={code}
              showPrintMargin={false}
              name="skill_code_editor"
              onChange={this.onChange}
              scrollPastEnd={false}
              wrapEnabled={true}
              readOnly={!this.props.editable}
              editorProps={{ $blockScrolling: true }}
            />
          </CodeEditorDiv>
        </HomeDiv>
      </div>
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

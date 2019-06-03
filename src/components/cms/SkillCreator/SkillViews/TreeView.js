import React, { Component } from 'react';
import OrgChart from 'react-orgchart';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Person from '@material-ui/icons/Person';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../redux/actions/ui';
import { fetchConversationResponse } from '../../../../apis/index';
import createActions from '../../../../redux/actions/create';
import 'react-orgchart/index.css';
import './TreeView.css';
import styled from 'styled-components';

const BotIconImg = styled.img`
  height: 1.313rem;
  vertical-align: middle;
  width: 1.313rem;
  color: #4285f5;
`;

const PersonIcon = styled(Person)`
  && {
    vertical-align: middle;
  }
`;

class TreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillData: {
        name: 'Welcome!', // Starting message of chatbot
        children: [], // contains subsequent user queries and bot responses
      },
      userInputs: [],
      loaded: false,
    };
  }

  componentDidMount = () => {
    this.skills = [];
    this.fetchUserInputs();
  };

  fetchUserInputs = () => {
    const { code } = this.props;
    let userInputs = [];
    let userQueries = [];
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (
        line &&
        !line.startsWith('::') &&
        !line.startsWith('!') &&
        !line.startsWith('#') &&
        !line.startsWith('{') &&
        !line.startsWith('}') &&
        !line.startsWith('"')
      ) {
        let userQuery = line;
        while (true) {
          i++;
          if (i >= lines.length) {
            break;
          }
          line = lines[i];
          if (
            line &&
            !line.startsWith('::') &&
            !line.startsWith('!') &&
            !line.startsWith('#')
          ) {
            break;
          }
        }
        userQueries.push(userQuery);
      }
    }
    for (let i = 0; i < userQueries.length; i++) {
      let queries = userQueries[i];
      let queryArray = queries.trim().split('|');
      for (let j = 0; j < queryArray.length; j++) {
        userInputs.push(queryArray[j]);
      }
    }
    this.setState({ userInputs }, () => this.getResponses(0));
  };

  getResponses = responseNumber => {
    const { actions, code } = this.props;
    const { userInputs } = this.state;
    let userQuery = userInputs[responseNumber];
    let skillData = {
      name: 'Welcome!',
      children: [],
    };
    let nodeData = this.state.skillData.children; // nodes of tree
    if (userQuery) {
      nodeData.push({
        type: 'user',
        name: userQuery,
        id: 'u' + responseNumber,
      });
      fetchConversationResponse({
        q: encodeURIComponent(userQuery),
        instant: encodeURIComponent(code),
      })
        .then(payload => {
          let answer;
          if (payload.answers[0]) {
            answer = payload.answers[0].actions[0].expression;
          } else {
            answer = 'Sorry, I could not understand what you just said.';
          }
          if (!nodeData[responseNumber].children) {
            nodeData[responseNumber].children = [];
            nodeData[responseNumber].children.push({
              id: 'b' + responseNumber,
              name: answer.trim(),
              type: 'bot',
            });
          } else {
            nodeData[responseNumber].children.push({
              id: 'b' + responseNumber,
              name: answer.trim(),
              type: 'bot',
            });
          }
          skillData.children = nodeData;
          this.setState(
            prevState => ({
              loaded:
                responseNumber + 1 === userInputs.length
                  ? true
                  : prevState.loaded,
              skillData,
            }),
            () => this.getResponses(++responseNumber),
          );
        })
        .catch(error => {
          actions.openSnackBar({
            snackBarMessage: 'Unable to load tree view. Please try again.',
            snackBarDuration: 2000,
          });
        });
    }
  };

  getNodeText = text => {
    if (text.indexOf(' ') > 0) {
      return text.substr(0, text.indexOf(' ')) + '...';
    }
    return text;
  };

  render() {
    const { loaded } = this.state;
    const { botbuilder } = this.props;
    const MyNodeComponent = ({ node }) => {
      return (
        <div className="initechNode">
          <span className="node-content" data-tip={node.name}>
            {node.type === 'bot' && (
              <BotIconImg
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIISURBVFhH7di/S5VRHMfxa0RG0A+kKCGkIkhHazEKatAGB0EhCIeQhgajbBBqqSmJgiASKxpqkNZwcBBdRHELyoZESpD8A5QITNT0/TG/8CXO/eG9Hp8LPR94Dc+X5+F8eTj3nPPczP+U43iHGxtXZZinWMMyKlUot7yEGpSDKpRDDuAORvAL1uAUXuEcEksH5mFNZfMBR7FjqcALhJrJ5gfOYEfyAKEm8lGTVYgazakVhBooxHtEzQBssFk046GreZNoQq+rraIOUXII/u31wPITVje3oOyHrz9ClLTAD/Qdl9Dtat5HnMcTV5MJREkn/EDFmkOU3EdoQHmDWpzapLm5gNC9qkdJA+5lEVo+WhG69y7SlEVOQyeUL5iJ4BuGcB27sKVcxW+EJnkMw9iHgnIWS7CHtWNk+0WWYhqL7rofBUXHI3uoCzq9jLvadrmIk1Cjuv4DLVV5YwdPv+LHalDxO9RtFXLF75uvVdhMzAZPwGp+fw9G3xJ2s37BlpgN1sBqj1XIlbRBp6gG98DWPz8fYjaol6KDrGraq/OmDc9xeOPqb8bw7wClugBLO56h6O/pPoQGKZY2Av8CSs4xfEZosK1Sczex7dmNejSW4DKOII1lL+yYH6KpkWi0VITmmRlEotH/LaHGjP7QTDQ6CX9CqDm5gsRTjbf4CjvOj+Ia0qTJnUxmHfGs+A6k/UOLAAAAAElFTkSuQmCC"
                alt="bot icon"
              />
            )}
            {node.type === 'user' && <PersonIcon />}&nbsp;{this.getNodeText(
              node.name,
            )}
          </span>
        </div>
      );
    };
    return (
      <div>
        {!loaded ? (
          <div className="center" style={{ padding: '1.25rem' }}>
            <CircularProgress size={62} color="#4285f5" />
            <h4>Loading</h4>
          </div>
        ) : (
          <div>
            <ReactTooltip effect="solid" place="bottom" />
            <div style={{ padding: botbuilder ? '0rem' : '1.875rem' }}>
              <OrgChart
                tree={this.state.skillData}
                NodeComponent={MyNodeComponent}
              />
              <br />
              <br />
            </div>
          </div>
        )}
      </div>
    );
  }
}

TreeView.propTypes = {
  botbuilder: PropTypes.bool,
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
    actions: bindActionCreators({ ...uiActions, ...createActions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TreeView);

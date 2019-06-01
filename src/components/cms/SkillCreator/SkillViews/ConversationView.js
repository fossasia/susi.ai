import React, { Component } from 'react';
import _Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../../redux/actions/ui';
import PropTypes from 'prop-types';
import { fetchConversationResponse } from '../../../../apis/index';
import Person from '@material-ui/icons/Person';
import CircularProgress from '@material-ui/core/CircularProgress';
import './ConversationView.css';
import styled from 'styled-components';

const Paper = styled(_Paper)`
  width: 100%;
  padding: 1.25rem;
`;

const BotIconImg = styled.img`
  height: 2.063rem;
  paddingtop: 0.563rem;
  width: 1.313rem;
  color: rgba(0, 0, 0, 0.87);
`;

const HomeDiv = styled.div`
  padding-top: 1.25rem;
`;

const MessageDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

class ConversationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInputs: [],
      conversationsData: [],
      loaded: false,
    };
  }

  componentDidMount = () => {
    this.fetchUserInputs();
  };

  fetchUserInputs = () => {
    let { code } = this.props;
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
    let { userInputs, conversationsData } = this.state;
    let userQuery = userInputs[responseNumber];
    if (userQuery) {
      conversationsData.push({
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
          conversationsData.push({
            type: 'bot',
            name: answer,
            id: 'b' + responseNumber,
          });
          this.setState(
            prevState => ({
              loaded:
                responseNumber + 1 === userInputs.length
                  ? true
                  : prevState.loaded,
              conversationsData,
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

  render() {
    let { conversationsData, loaded } = this.state;
    return (
      <HomeDiv>
        <Paper id="message-container" zDepth={1}>
          {!loaded ? (
            <div className="center">
              <CircularProgress size={62} color="#4285f5" />
              <h4>Loading</h4>
            </div>
          ) : (
            conversationsData.map(item => {
              let text = item.name;
              let messageArr = text.match(/.{1,28}/g);
              let message = [];
              if (messageArr && messageArr.length > 0) {
                for (let i = 0; i < messageArr.length; i++) {
                  message.push(<div>{messageArr[i]}</div>);
                }
              }
              if (item.type === 'user') {
                return (
                  <MessageDiv key={item.id}>
                    <div className="user-text-box">{message}</div>
                    <Person style={{ height: '2.5rem' }} />
                  </MessageDiv>
                );
              }
              return (
                <MessageDiv key={item.id}>
                  <BotIconImg
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIISURBVFhH7di/S5VRHMfxa0RG0A+kKCGkIkhHazEKatAGB0EhCIeQhgajbBBqqSmJgiASKxpqkNZwcBBdRHELyoZESpD8A5QITNT0/TG/8CXO/eG9Hp8LPR94Dc+X5+F8eTj3nPPczP+U43iHGxtXZZinWMMyKlUot7yEGpSDKpRDDuAORvAL1uAUXuEcEksH5mFNZfMBR7FjqcALhJrJ5gfOYEfyAKEm8lGTVYgazakVhBooxHtEzQBssFk046GreZNoQq+rraIOUXII/u31wPITVje3oOyHrz9ClLTAD/Qdl9Dtat5HnMcTV5MJREkn/EDFmkOU3EdoQHmDWpzapLm5gNC9qkdJA+5lEVo+WhG69y7SlEVOQyeUL5iJ4BuGcB27sKVcxW+EJnkMw9iHgnIWS7CHtWNk+0WWYhqL7rofBUXHI3uoCzq9jLvadrmIk1Cjuv4DLVV5YwdPv+LHalDxO9RtFXLF75uvVdhMzAZPwGp+fw9G3xJ2s37BlpgN1sBqj1XIlbRBp6gG98DWPz8fYjaol6KDrGraq/OmDc9xeOPqb8bw7wClugBLO56h6O/pPoQGKZY2Av8CSs4xfEZosK1Sczex7dmNejSW4DKOII1lL+yYH6KpkWi0VITmmRlEotH/LaHGjP7QTDQ6CX9CqDm5gsRTjbf4CjvOj+Ia0qTJnUxmHfGs+A6k/UOLAAAAAElFTkSuQmCC"
                    alt="bot icon"
                  />
                  <div className="bot-text-box">{message}</div>
                </MessageDiv>
              );
            })
          )}
        </Paper>
      </HomeDiv>
    );
  }
}

ConversationView.propTypes = {
  skillCode: PropTypes.string,
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
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConversationView);

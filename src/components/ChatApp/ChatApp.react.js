import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ChatApp.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../redux/actions/messages';
import { createMessagePairArray } from '../../utils/formatMessage';

class ChatApp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    app: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { uuid } = props.app;
    this.state = {
      uuid,
    };
  }

  componentDidMount() {
    const { actions } = this.props;
    actions
      .getHistoryFromServer()
      .then(({ payload }) => {
        createMessagePairArray(payload).then(messagePairArray => {
          actions.initializeMessageStore(messagePairArray);
        });
      })
      .catch(error => {
        actions.initializeMessageStoreFailed();
        console.log(error);
      });
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
  }

  render() {
    return (
      <div className="chatapp">
        <MessageSection {...this.props} />
      </div>
    );
  }
}

function mapStateToProps({ app }) {
  return {
    app,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatApp);

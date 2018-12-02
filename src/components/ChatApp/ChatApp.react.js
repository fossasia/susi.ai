import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ChatApp.css';
import history from '../../history';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../redux/actions/messages';
import { createMessagePairArray } from '../../utils/formatMessage';

class ChatApp extends Component {
  static propTypes = {
    actions: PropTypes.object,
  };

  componentDidMount() {
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
    this.props.actions
      .initializeMessageStore()
      .then(({ payload }) => {
        this.props.actions.createHistoryMessages(
          createMessagePairArray(payload),
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="chatapp">
        <MessageSection {...this.props} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(ChatApp);

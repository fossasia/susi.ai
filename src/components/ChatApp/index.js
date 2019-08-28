import MessageSection from './MessageSection';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ChatApp extends Component {
  static propTypes = {
    actions: PropTypes.object,
    app: PropTypes.object,
    history: PropTypes.object,
  };

  componentDidMount() {
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
  }

  render() {
    const { history } = this.props;
    return <MessageSection history={history} />;
  }
}

export default withRouter(ChatApp);

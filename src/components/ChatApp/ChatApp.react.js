import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import './ChatApp.css';
import history from '../../history';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import skillLogo from '../../images/susi-skill-logo.png';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const fabStyle = {
  right: 15,
  bottom: 15,
  position: 'fixed',
};

export default class ChatApp extends Component {
  componentDidMount() {
    document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
    // force an update if the URL changes
    history.listen(() => this.forceUpdate());
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <FloatingActionButton style={fabStyle}>
            <a href="https://skills.susi.ai/">
              <img src={skillLogo} alt="Susi Skills" />;
            </a>
          </FloatingActionButton>
          <div className="chatapp">
            <MessageSection {...this.props} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

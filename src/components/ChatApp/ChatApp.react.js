import MessageSection from './MessageSection/MessageSection.react';
import React, { Component } from 'react';
import './ChatApp.css';
import history from '../../history';


export default class ChatApp extends Component {

  componentDidMount() {
      document.title = 'SUSI.AI Chat - Open Source Artificial Intelligence';
      // force an update if the URL changes
      history.listen(() => this.forceUpdate());
   }

  render() {
    return (
      <div className='chatapp'>
        <MessageSection {...this.props}/>
      </div>
    );
  }

};

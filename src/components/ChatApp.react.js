
import MessageSection from './MessageSection.react';
import React from 'react';
import './ChatApp.css';

export default class ChatApp extends React.Component {

  render() {

    return (

      <div className='chatapp'>
        <MessageSection />
      </div>
    );
  }

};

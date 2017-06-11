
import MessageSection from './MessageSection.react';
import React from 'react';
import './ChatApp.css';
import history from '../../history';


export default class ChatApp extends React.Component {

  componentDidMount() {
      // force an update if the URL changes
      history.listen(() => this.forceUpdate());
   }

  render() {

    return (

      <div className='chatapp'>
        <MessageSection />
      </div>
    );
  }

};

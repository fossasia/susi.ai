import React from 'react';
import { PropTypes } from 'prop-types';
import Linkify from 'react-linkify';

export const parseAndReplace = (text) => {return <Linkify properties={{target:"_blank"}}>{text}</Linkify>;}

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;
    let stringWithLinks = this.props.message.text;  
    let replacedText = parseAndReplace(stringWithLinks);
    
    return (
      <li className="message-list-item">
        <h5 className="message-author-name">{message.authorName}</h5>
        <div className="message-time">
          {message.date.toLocaleTimeString()}
        </div>
        <div className="message-text">{replacedText}</div>
      </li>
    );
  }

};

MessageListItem.propTypes = {
  message: PropTypes.object
};

export default MessageListItem;

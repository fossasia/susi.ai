import React from 'react';
import { PropTypes } from 'prop-types';
const processString = require('react-process-string');

class MessageListItem extends React.Component {

  render() {
    let {message} = this.props;
    let stringWithLinks = this.props.message.text;    
    
    //URLs starting with http://, https://, or ftp:// or www.
    let config = [{
        regex: /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim,
        fn: (key, result) => <span key={key}>
                                  <a target="_blank" href={`${result[1]}`}>Click Here!</a>
                             </span>
    }, {
        regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
        fn: (key, result) => <span key={key}>
                                 <a target="_blank" href={`http://${result[1]}.${result[2]}${result[3]}`}>Click Here!</a>{result[4]}
                             </span>
    }];

    let replacedText = processString(config)(stringWithLinks);

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

import * as Actions from '../../actions/';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ThreadListItem = props => {
  const _onClick = () => {
    if (props.thread) {
      Actions.clickThread(props.thread.id);
    }
  };

  let thread = '';
  let lastMessage = '';
  if (props.thread) {
    thread = props.thread;
    lastMessage = thread.lastMessage;
  }

  return (
    <li
      className={classNames({
        'thread-list-item': true,
        active: thread.id === props.currentThreadID,
      })}
      onClick={_onClick()}
    >
      <h5 className="thread-name">{thread.name}</h5>
      <div className="thread-time">
        {lastMessage ? lastMessage.date.toLocaleTimeString() : null}
      </div>
      <div className="thread-last-message">{lastMessage.text}</div>
    </li>
  );
};

ThreadListItem.propTypes = {
  thread: PropTypes.object,
  currentThreadID: PropTypes.string,
};

export default ThreadListItem;

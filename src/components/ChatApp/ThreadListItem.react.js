
import * as Actions from '../../actions/';
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ThreadListItem extends Component {

  render() {
    let thread = this.props.thread;
    let lastMessage = thread.lastMessage;
    return (
      <li
        className={classNames({
          'thread-list-item': true,
          'active': thread.id === this.props.currentThreadID
        })}
        onClick={this._onClick.bind(this)}>
        <h5 className="thread-name">{thread.name}</h5>
        <div className="thread-time">
          {lastMessage.date.toLocaleTimeString()}
        </div>
        <div className="thread-last-message">
          {lastMessage.text}
        </div>
      </li>
    );
  }

  _onClick() {
    Actions.clickThread(this.props.thread.id);
  }

};

ThreadListItem.propTypes = {
  thread: PropTypes.object,
  currentThreadID: PropTypes.string
};

export default ThreadListItem;

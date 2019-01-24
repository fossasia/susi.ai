import React, { Component } from 'react';
import ThreadListItem from './ThreadListItem.react';
import ThreadStore from '../../stores/ThreadStore';
import UnreadThreadStore from '../../stores/UnreadThreadStore';

function getStateFromStores() {
  return {
    threads: ThreadStore.getAllChrono(),
    currentThreadID: ThreadStore.getCurrentID(),
    unreadCount: UnreadThreadStore.getCount(),
  };
}

export default class ThreadSection extends Component {
  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  componentDidMount() {
    ThreadStore.addChangeListener(this._onChange);
    UnreadThreadStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ThreadStore.removeChangeListener(this._onChange);
    UnreadThreadStore.removeChangeListener(this._onChange);
  }

  render() {
    const threadListItems = this.state.threads.map(function(thread) {
      return (
        <ThreadListItem
          key={thread.id}
          thread={thread}
          currentThreadID={this.state.currentThreadID}
        />
      );
    }, this);
    const unread =
      this.state.unreadCount === 0 ? null : (
        <span>Unread threads: {this.state.unreadCount}</span>
      );
    return (
      <div className="thread-section">
        <div className="thread-count">{unread}</div>
        <ul className="thread-list">{threadListItems}</ul>
      </div>
    );
  }
  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
}

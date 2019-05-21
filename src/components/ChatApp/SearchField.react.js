import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import ExitIcon from '@material-ui/icons/Close';

const animationStyle = {
  transition: 'width 0.75s cubic-bezier(0.000, 0.795, 0.000, 1.000)',
};

const additionalStyles = {
  text: animationStyle,
  frame: animationStyle,
};

const ESCAPE_KEY = 27;
const F_KEY = 70;

class ExpandingSearchField extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, indexCnt: 0 };
  }

  closeSearch = state => {
    if (this.props.open) {
      this.setState({ isOpen: false });
      this.setState({ indexCnt: 0 });
      this.props.exitSearch();
    }
  };

  toggleSearch = () => {
    this.setState({ isOpen: !this.props.open });
    if (!this.props.open) {
      this.props.activateSearch();
    } else {
      this.closeSearch();
      this.props.exitSearch();
    }
  };

  handleKeyDown = event => {
    switch (event.keyCode) {
      case ESCAPE_KEY:
        this.closeSearch();
        break;
      case F_KEY:
        if (event.ctrlKey || event.metaKey) {
          this.toggleSearch();
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  onClick = () => {
    this.toggleSearch();
  };

  onChange = event => {
    this.props.onTextChange(event);
    setTimeout(() => {
      this.setState({ indexCnt: this.props.searchCount });
    }, 10);
  };

  onClickRecent = (state, props) => {
    const { searchCount } = this.props;

    const { indexCnt } = this.state;
    if (searchCount !== 0) {
      this.props.scrollRecent();
      this.setState({
        indexCnt: (indexCnt % searchCount) + 1,
      });
    }
  };

  onClickPrev = (state, props) => {
    const { searchCount } = this.props;

    const { indexCnt } = this.state;
    if (searchCount !== 0) {
      this.props.scrollPrev();
    }
    if (indexCnt > 1) {
      this.setState({ indexCnt: indexCnt - 1 });
    } else if (indexCnt === 1) {
      for (let i = 0; i < searchCount; i++) {
        if (searchCount !== 0) {
          this.props.scrollRecent();
        }
      }
      this.setState({ indexCnt: searchCount });
    } else if (indexCnt < 1) {
      if (searchCount !== 0) {
        this.setState({ indexCnt: searchCount - 1 });
      }
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const baseStyles = {
      open: {
        width: 180,
      },

      closed: {
        width: 0,
      },

      smallIcon: {
        fill: 'white',
      },

      icon: {
        width: 40,
        height: 40,
        padding: 5,
        top: 10,
      },

      frame: {},
    };

    const { searchCount } = this.props;

    const { indexCnt } = this.state;

    let textStyle = this.props.open ? baseStyles.open : baseStyles.closed;
    textStyle = Object.assign(
      textStyle,
      additionalStyles ? additionalStyles.text : {},
    );

    const divStyle = Object.assign(
      {},
      textStyle,
      baseStyles.frame,
      additionalStyles ? additionalStyles.frame : {},
    );
    divStyle.width += baseStyles.icon.width + 5;
    divStyle.display = 'inline';

    if (this.props.open) {
      return (
        <div style={divStyle} className="searchComponent">
          <TextField
            name="search"
            className="searchInputField"
            placeholder="Search..."
            value={this.props.searchText}
            onChange={event => this.onChange(event)}
            autoFocus={true}
            style={{ marginTop: '11px' }}
            InputProps={{
              style: {
                color: 'white',
              },
            }}
          />
          <span style={{ marginTop: '11px' }} className="counter">
            {indexCnt}/{searchCount}
          </span>
          <IconButton
            className="displayNone"
            style={baseStyles.icon}
            onClick={this.onClickPrev}
            color="inherit"
          >
            <UpIcon />
          </IconButton>
          <IconButton
            className="displayNone"
            style={baseStyles.icon}
            onClick={this.onClickRecent}
            color="inherit"
          >
            <DownIcon />
          </IconButton>
          <IconButton
            className="displayCloseNone"
            style={baseStyles.icon}
            onClick={this.onClick}
            color="inherit"
          >
            <ExitIcon />
          </IconButton>
        </div>
      );
    }
    return (
      <div style={divStyle}>
        <IconButton
          className="displayNone displayCloseNone"
          style={baseStyles.icon}
          onClick={this.onClick}
          color="inherit"
        >
          <SearchIcon />
        </IconButton>
      </div>
    );
  }
}

ExpandingSearchField.propTypes = {
  activateSearch: PropTypes.func,
  exitSearch: PropTypes.func,
  onTextChange: PropTypes.func,
  scrollRecent: PropTypes.func,
  scrollPrev: PropTypes.func,
  searchIndex: PropTypes.number,
  searchCount: PropTypes.number,
  searchText: PropTypes.string,
  open: PropTypes.bool,
};

export default ExpandingSearchField;

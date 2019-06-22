import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton as _IconButton } from '@material-ui/core';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import ExitIcon from '@material-ui/icons/Close';

const ESCAPE_KEY = 27;
const F_KEY = 70;

const SearchInputField = styled(TextField)`
  margin-top: 0.7rem;
  @media (max-width: 560px) {
    width: 9rem;
  }
  @media (max-width: 380px) {
    width: 7.8rem;
  }
`;

const IconButton = styled(_IconButton)`
  @media (max-width: 560px) {
    padding: 4px;
  }
  @media (max-width: 300px) {
    display: none;
  }
`;

const CloseButton = styled(_IconButton)`
  @media (max-width: 560px) {
    padding: 4px;
  }
  @media (max-width: 300px) {
    position: relative;
    top: 0.375rem;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled(FlexContainer)`
  transition: width 0.75s cubic-bezier(0, 0.795, 0, 1);
`;

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
    const { searchCount, open, searchText } = this.props;
    const { indexCnt } = this.state;
    if (open) {
      return (
        <Container>
          <SearchInputField
            name="search"
            placeholder="Search Message"
            value={searchText}
            onChange={event => this.onChange(event)}
            autoFocus={true}
            InputProps={{
              style: {
                color: 'white',
              },
            }}
          />
          <FlexContainer>
            {indexCnt}/{searchCount}
          </FlexContainer>
          <IconButton onClick={this.onClickPrev} color="inherit">
            <UpIcon />
          </IconButton>
          <IconButton onClick={this.onClickRecent} color="inherit">
            <DownIcon />
          </IconButton>
          <CloseButton onClick={this.onClick} color="inherit">
            <ExitIcon />
          </CloseButton>
        </Container>
      );
    }
    return (
      <Container>
        <IconButton onClick={this.onClick} color="inherit">
          <SearchIcon />
        </IconButton>
      </Container>
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

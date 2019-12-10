import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton as _IconButton } from '@material-ui/core';
import styled, { css } from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import _CloseIcon from '@material-ui/icons/Close';
import _UpIcon from '@material-ui/icons/ExpandLess';
import _DownIcon from '@material-ui/icons/ExpandMore';
import ToolTip from '../shared/ToolTip';

const ESCAPE_KEY = 27;
const F_KEY = 70;

const NavigationIconStyle = css`
  width: 0.8rem;
  height: 0.8rem;
  color: #fff;
`;

const CloseIcon = styled(_CloseIcon)`
  ${NavigationIconStyle}
  margin-top: -6px;
`;
const UpIcon = styled(_UpIcon)`
  ${NavigationIconStyle}
  margin-top: -6px;
`;
const DownIcon = styled(_DownIcon)`
  ${NavigationIconStyle}
  margin-top: -6px;
`;

const NavigateIconButton = styled(_IconButton)`
  padding: 8px;
  ${NavigationIconStyle}
  margin-left: 0.8rem;
`;

const SearchInputField = styled(TextField)`
  font-size: 10px;
  color: #fefefe;
  border-right: 1px solid #878787;
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
  .MuiOutlinedInput-input {
    padding: 18.5px 28px 18.5px 2px;
    width: 11rem;
    font-size: 0.7rem;
  }
`;

const IconButton = styled(_IconButton)`
  padding: 3.5px;
  color: #fff;
`;

const FlexContainer = styled.div`
  border-radius: 5px;
  height: 24px;
  top: 4px;
  color: #f2f2f2;
  padding: 2px;
  font-size: 0.8rem;
  position: absolute;
  left: 120px;
`;

const Container = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  width: auto;
  max-width: 300px;
  transition: width 0.75s cubic-bezier(0, 0.795, 0, 1);
  @media (max-width: 500px) {
    max-width: 90%;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 47px;
  background: #555555;
  z-index: 1;
  right: 10px;
  width: 15rem;
  display: flex;
  padding: 4px 8px;
  align-items: center;
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
    return (
      <React.Fragment>
        <Container>
          <IconButton onClick={this.onClick}>
            <ToolTip title="Search">
              <SearchIcon />
            </ToolTip>
          </IconButton>
        </Container>
        {open && (
          <SearchContainer>
            <SearchInputField
              name="search"
              placeholder="Search Messages"
              value={searchText}
              onChange={event => this.onChange(event)}
              variant="outlined"
              autoFocus={false}
              style={{ height: '24px', width: '70%' }}
              InputProps={{
                style: {
                  height: '24px',
                  width: '200',
                  color: '#f2f2f2',
                },
              }}
            />
            {searchText && (
              <FlexContainer>
                {indexCnt}/{searchCount}
              </FlexContainer>
            )}
            <NavigateIconButton onClick={this.onClickPrev}>
              <UpIcon />
            </NavigateIconButton>
            <NavigateIconButton onClick={this.onClickRecent}>
              <DownIcon />
            </NavigateIconButton>
            <NavigateIconButton onClick={this.onClick}>
              <CloseIcon />
            </NavigateIconButton>
          </SearchContainer>
        )}
      </React.Fragment>
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

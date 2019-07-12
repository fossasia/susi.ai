import React from 'react';
import _SearchBar from 'material-ui-search-bar';
import styled from 'styled-components';
import _Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const StyledSearchBar = styled(_SearchBar)`
  margin: 0.5rem;
  padding-left: ${props => `${props.paddingLeft}rem`};
  @media (max-width: 960px) {
    width: 70%;
  }
  @media (max-width: 840px) {
    width: 65%;
  }
  @media (max-width: 700px) {
    width: 60%;
  }
  @media (max-width: 600px) {
    width: 55%;
  }
  @media (max-width: 600px) {
    width: 55%;
  }
  @media (max-width: 520px) {
    width: 100%;
  }
`;

const Select = styled(_Select)`
  background-color: #f3f3f3;
  width: ${props => `${props.width}rem`};
  position: absolute;
  height: 49px;
  margin-left: 0.5rem;
  :hover {
    background-color: #dadada;
    border-color: rgba(0, 0, 0, 0.23);
  }
`;

const SearchBar = props => {
  const {
    searchType,
    searchSelectWidth,
    handleSearchTypeChange,
    value,
    onChange,
  } = props;
  return (
    <div>
      <Select
        value={searchType}
        onChange={handleSearchTypeChange}
        input={<OutlinedInput />}
        width={searchSelectWidth}
      >
        <MenuItem value="skill_name">Skill</MenuItem>
        <MenuItem value="descriptions">Description</MenuItem>
        <MenuItem value="examples">Examples</MenuItem>
        <MenuItem value="author">Author</MenuItem>
      </Select>
      <StyledSearchBar
        paddingLeft={searchSelectWidth}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchType: PropTypes.string,
  searchSelectWidth: PropTypes.string,
  handleSearchTypeChange: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchBar;

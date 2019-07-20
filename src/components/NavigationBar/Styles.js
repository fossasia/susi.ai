import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import _ExpandMore from '@material-ui/icons/ExpandMore';
import _Toolbar from '@material-ui/core/Toolbar';
import Select from '@material-ui/core/Select';

export const StyledIconButton = styled(IconButton)`
  border-radius: 2px;
  padding: ${props => (props.padding ? props.padding : '0.2rem 0.5rem')};
`;

export const OutlinedSelectStyles = css`
  background-color: #f3f3f3;
  height: 35px;
  :hover {
    background-color: #dadada;
    border-color: rgba(117, 117, 117, 0.23);
  }
  &.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #dadada;
  }
  .MuiOutlinedInput-input {
    padding: 8.95px 14px;
  }
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const LanguageSelect = styled(Select)`
  ${OutlinedSelectStyles}
  max-width: 14rem;
  border-radius: 4px;
  @media (max-width: 550px) {
    width: 6rem;
  }
  .MuiOutlinedInput-input {
    padding: 4px;
  }
  .MuiInputBase-inputSelect {
    padding-right: 1.75rem;
  }
`;

export const UserDetail = styled.div`
  color: white;
  margin-right: 5px;
  font-size: 1rem;
  cursor: pointer;
  bottom: 8px;
  @media (max-width: 1000px) {
    display: None;
  }
`;
export const CreateDetail = styled.div`
  color: white;
  margin-right: 5px;
  font-size: 1rem;
  cursor: pointer;
  bottom: 8px;
`;

export const ExpandMore = styled(_ExpandMore)`
  color: white;
`;

export const SusiLogo = styled.img`
  height: 1.5rem;
  display: block;
  ${props =>
    props.marginRight &&
    css`
      margin-right: ${props => props.marginRight + 'px'};
    `}
`;

export const TopRightMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
`;

export const SusiLogoContainer = styled.div`
  @media (max-width: 680px) {
    ${props =>
      props.isSearchOpen &&
      css`
        display: none;
      `}
  }
`;

export const Toolbar = styled(_Toolbar)`
  height: 46px;
  background-color: rgb(66, 133, 244);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NavLinkContainer = styled.div`
  margin-left: 2rem;
  display: flex;
  align-items: center;
  @media (max-width: 800px) {
    display: none;
  }
`;

export const NavButton = styled(StyledIconButton)`
  margin: 0 1rem;
  text-transform: none;
  color: white;
  word-spacing: 2px;
  font-size: 1rem;
  padding: 0.75rem;
  ${props =>
    props.isActive === true &&
    css`
      border-bottom: 2px solid #ffffff;
    `}
`;

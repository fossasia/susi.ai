import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _Toolbar from '@material-ui/core/Toolbar';
import ListItemIcon from '../shared/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import ISO6391 from 'iso-639-1';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Translate from '../Translate/Translate.react';
import styled, { css } from 'styled-components';
import CircleImage from '../shared/CircleImage';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
import skillsAction from '../../redux/actions/skills';
import skillAction from '../../redux/actions/skill';
import Link from '../shared/Link';
import storageService from '../../utils/storageService';
import Settings from '@material-ui/icons/Settings';
import Exit from '@material-ui/icons/ExitToApp';
import Dashboard from '@material-ui/icons/Dashboard';
import Add from '@material-ui/icons/Add';
import Polymer from '@material-ui/icons/Polymer';
import BotIcon from '@material-ui/icons/PersonPin';
import DeviceIcon from '@material-ui/icons/Devices';
import susiWhite from '../../images/susi-logo-white.png';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Popper from './Popper';
import _ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandingSearchField from '../ChatApp/SearchField.react';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import Chat from '@material-ui/icons/Chat';
import { StyledIconButton, OutlinedSelectStyles } from './Styles';
import { FlexContainer } from '../shared/Container';
import ListIcon from '@material-ui/icons/List';
import SearchBar from './SearchBar';
import _ from 'lodash';
import LanguageIcon from '@material-ui/icons/Language';
import DashIcon from '@material-ui/icons/Remove';
import susiFevicon from '../../images/favicon.png';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import isMobileView from '../../utils/isMobileView';
import ToolTip from '../shared/ToolTip';
import Devices from '@material-ui/icons/Devices';
import Person from '@material-ui/icons/Person';

const LanguageSelect = styled(Select)`
  ${OutlinedSelectStyles}
  max-width: 13rem;
  border-radius: 4px;
  @media (max-width: 550px) {
    width: 6rem;
  }
  .MuiOutlinedInput-input {
    padding-right: 1.6rem;
  }
  @media (max-width: 430px) {
    .MuiOutlinedInput-input {
      padding-right: 2rem;
    }
  }
`;

const UserDetail = styled.div`
  color: white;
  margin-right: 5px;
  font-size: 1rem;
  cursor: pointer;
  bottom: 8px;
  width: auto;
  max-width: 165px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 1000px) {
    display: None;
  }
`;
const CreateDetail = styled.div`
  color: white;
  margin-right: 5px;
  font-size: 1rem;
  cursor: pointer;
  bottom: 8px;
`;

const ExpandMore = styled(_ExpandMore)`
  color: white;
`;

const SusiLogo = styled.img`
  height: 1.5rem;
  display: block;
  ${props =>
    props.marginRight &&
    css`
      margin-right: ${props => props.marginRight + 'px'};
    `}
`;

const TopRightMenuContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
`;

const SusiLogoContainer = styled.div`
  @media (max-width: 680px) {
    ${props =>
      props.isSearchOpen &&
      css`
        display: none;
      `}
  }
`;

const Toolbar = styled(_Toolbar)`
  height: 46px;
  background-color: rgb(66, 133, 244);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

HideOnScroll.propTypes = {
  children: PropTypes.element,
};

const selectMenuWidth = {
  // eslint-disable-next-line camelcase
  skill_name: 4.8,
  descriptions: 8,
  examples: 7.4,
  author: 5.9,
};

class NavigationBar extends Component {
  static propTypes = {
    history: PropTypes.object,
    settings: PropTypes.object,
    location: PropTypes.object,
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
    email: PropTypes.string,
    userName: PropTypes.string,
    userSettingsLoaded: PropTypes.bool,
    app: PropTypes.string,
    actions: PropTypes.object,
    avatarImgThumbnail: PropTypes.string,
    searchTextChanged: PropTypes.func,
    openSearch: PropTypes.func,
    exitSearch: PropTypes.func,
    nextSearchItem: PropTypes.func,
    previousSearchItem: PropTypes.func,
    search: PropTypes.bool,
    searchState: PropTypes.object,
    searchQuery: PropTypes.string,
    searchType: PropTypes.array,
    routeType: PropTypes.string,
    routeValue: PropTypes.string,
    filterType: PropTypes.string,
    languageValue: PropTypes.array,
    reviewed: PropTypes.bool,
    staffPicks: PropTypes.bool,
    groupValue: PropTypes.string,
    orderBy: PropTypes.string,
    languages: PropTypes.array,
    mode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchType: this.props.searchType,
      searchSelectWidth: this.getSelectMenuWidth(this.props.searchType),
      showSearchBar: !isMobileView(1000),
      rightContainer: true,
    };
  }

  openFullScreen = () => {
    const { actions } = this.props;
    actions.setChatMode({
      mode: 'fullScreen',
    });
  };

  openPreview = () => {
    const { mode, actions } = this.props;
    actions.setChatMode({
      mode: mode === 'minimize' ? 'preview' : 'minimize',
    });
  };

  handleLogin = () => {
    const { actions } = this.props;
    actions.openModal({ modalType: 'login' });
  };

  handleSearchTypeChange = async e => {
    const { actions, searchQuery } = this.props;
    const { value: searchType } = e.target;
    if (searchType.length === 0) {
      searchType.push('skill_name');
    }
    await actions.setSearchFilter({ searchType });
    this.setState({
      searchSelectWidth: this.getSelectMenuWidth(searchType),
    });
    if (searchQuery !== '') {
      this.loadCards();
    }
  };

  handleSearch = async value => {
    if (typeof value !== 'string') {
      value = '';
    }
    value = value.trim();
    await this.props.actions.setSearchFilter({ searchQuery: value });
    this.loadCards();
    if (value !== '') {
      this.props.history.push('/');
    }
  };

  componentDidMount() {
    this.loadLanguages('All');
  }

  loadLanguages = value => {
    this.props.actions
      .getLanguageOptions({ groupValue: value })
      .catch(error => {
        console.log(error);
      });
  };

  loadCards = () => {
    const { routeType, routeValue } = this.props;
    const {
      languageValue,
      filterType,
      reviewed,
      staffPicks,
      groupValue,
      searchQuery,
      orderBy,
      searchType,
    } = this.props;
    let payload = {
      groupValue: groupValue,
      language: languageValue,
      applyFilter: true,
      filterName: orderBy,
      filterType: filterType,
      showReviewedSkills: reviewed,
      showStaffPicks: staffPicks,
      searchQuery,
    };
    if (routeType === 'category') {
      this.props.actions.setCategoryFilter({ groupValue: routeValue });
      this.loadLanguages(routeValue);
      payload = { ...payload, groupValue: routeValue };
    } else if (routeType === 'language') {
      this.setState({
        languageValue: routeValue,
      });
      payload = { ...payload, languageValue: routeValue };
    }
    if (searchQuery.length > 0) {
      payload = {
        ...payload,
        searchQuery,
        searchType,
      };
    }
    this.props.actions.getSkills(payload);
  };

  getSelectMenuWidth = searchTypes => {
    if (searchTypes.length === 4) {
      return '4.1';
    }
    if (searchTypes.length === 0) {
      return '4';
    }
    let addedWidth = 0;
    let count = 0;
    for (let i = 0; i < searchTypes.length; i++) {
      addedWidth += selectMenuWidth[searchTypes[i]];
      count++;
    }
    return count > 1
      ? (addedWidth - count * 1.1).toString()
      : addedWidth.toString();
  };

  languageMenuItems = values => {
    return this.props.languages.map(name => (
      <MenuItem
        key={name}
        checked={values && values.indexOf(name) > -1}
        value={name}
      >
        {ISO6391.getNativeName(name)
          ? `${ISO6391.getNativeName(name)} - ${name.toUpperCase()}`
          : 'Universal'}
      </MenuItem>
    ));
  };

  handleLanguageChange = async (event, index, values) => {
    storageService.set('languages', event.target.value, 'local');
    let languages = event.target.value;
    if (languages.length === 0) {
      languages.push('en');
    }
    await this.props.actions.setLanguageFilter({
      languageValue: languages,
    });
    if (
      this.props.routeType ||
      ['category', 'language'].includes(window.location.href.split('/')[4])
    ) {
      this.loadCards();
    } else {
      this.loadMetricsSkills();
    }
  };

  loadMetricsSkills = () => {
    this.props.actions.getMetricsSkills({
      languageValue: this.props.languageValue,
    });
  };

  toggleSearchBar = () => {
    this.setState(prevState => ({
      showSearchBar: !prevState.showSearchBar,
      rightContainer: !prevState.rightContainer,
    }));
  };

  render() {
    const {
      accessToken,
      isAdmin,
      email,
      userName,
      userSettingsLoaded,
      avatarImgThumbnail,
      history,
      searchState,
      search,
      searchTextChanged,
      exitSearch,
      openSearch,
      nextSearchItem,
      previousSearchItem,
      searchQuery,
      searchType,
      languageValue,
    } = this.props;
    const { searchSelectWidth, showSearchBar } = this.state;
    const Logged = props => (
      <React.Fragment>
        <Link to="/dashboard">
          <MenuItem>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Dashboard" />
            </ListItemText>
          </MenuItem>
        </Link>
        <Link to="/myskills">
          <MenuItem>
            <ListItemIcon>
              <Polymer />
            </ListItemIcon>
            <ListItemText>
              <Translate text="My Skills" />
            </ListItemText>
          </MenuItem>
        </Link>
        <Link to="/mybots">
          <MenuItem>
            <ListItemIcon>
              <BotIcon />
            </ListItemIcon>
            <ListItemText>
              <Translate text="My Bots" />
            </ListItemText>
          </MenuItem>
        </Link>
        <Link to="/mydevices">
          <MenuItem>
            <ListItemIcon>
              <DeviceIcon />
            </ListItemIcon>
            <ListItemText>
              <Translate text="My Devices" />
            </ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        <Link to="/settings">
          <MenuItem>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Settings" />
            </ListItemText>
          </MenuItem>
        </Link>
        {isAdmin ? (
          <Link to="/admin">
            <MenuItem>
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText>
                <Translate text="Admin" />
              </ListItemText>
            </MenuItem>
          </Link>
        ) : null}
        <Link to="/logout">
          <MenuItem>
            <ListItemIcon>
              <Exit />
            </ListItemIcon>
            <ListItemText>
              <Translate text="Logout" />
            </ListItemText>
          </MenuItem>
        </Link>
      </React.Fragment>
    );

    let userAvatar = null;
    if (accessToken) {
      userAvatar = avatarImgThumbnail;
    }
    let renderSusiIcon = null;
    let renderSearchBar = null;
    if (!isMobileView(900)) {
      renderSusiIcon = (
        <SusiLogo marginRight={24} src={susiWhite} alt="susi-logo" />
      );
    }
    if (isMobileView(900) && !showSearchBar) {
      renderSusiIcon = <SusiLogo src={susiFevicon} alt="susi-logo" />;
    }
    if (showSearchBar) {
      renderSearchBar = (
        <React.Fragment>
          <SearchBar
            handleSearchTypeChange={this.handleSearchTypeChange}
            onChange={_.debounce(this.handleSearch, 100)}
            onRequestSearch={this.loadCards}
            value={searchQuery}
            searchType={searchType}
            onClose={_.debounce(this.handleSearch, 100)}
            searchSelectWidth={searchSelectWidth}
          />
          <LanguageSelect
            value={languageValue}
            onChange={this.handleLanguageChange}
            multiple
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
              getContentAnchorEl: null,
            }}
            input={<OutlinedInput />}
            displayEmpty={true}
            renderValue={selected => {
              let transformedArray = [];
              for (let i = 0; i < selected.length; i++) {
                transformedArray.push(selected[i].toUpperCase());
              }
              return (
                <FlexContainer style={{ color: '#565656' }}>
                  <LanguageIcon style={{ marginRight: '4px' }} />{' '}
                  {transformedArray.length > 0 ? (
                    <div>{transformedArray.join(', ')}</div>
                  ) : (
                    <DashIcon style={{ color: '#565656' }} />
                  )}
                </FlexContainer>
              );
            }}
          >
            {this.languageMenuItems(languageValue)}
          </LanguageSelect>
          {isMobileView(900) && (
            <IconButton color="inherit" onClick={this.toggleSearchBar}>
              <CloseIcon />
            </IconButton>
          )}
        </React.Fragment>
      );
    } else {
      renderSearchBar = (
        <IconButton color="inherit" onClick={this.toggleSearchBar}>
          <SearchIcon />
        </IconButton>
      );
    }

    return (
      <div>
        <CssBaseline />
        <HideOnScroll>
          <AppBar>
            <Toolbar variant="dense">
              <FlexContainer>
                <SusiLogoContainer isSearchOpen={search}>
                  <Link to="/" style={{ outline: '0' }}>
                    {renderSusiIcon}
                  </Link>
                </SusiLogoContainer>
                {renderSearchBar}
              </FlexContainer>
              <TopRightMenuContainer
                style={{ display: this.state.rightContainer ? 'flex' : 'none' }}
              >
                {searchState ? (
                  <ExpandingSearchField
                    searchText={searchState.searchText}
                    searchIndex={searchState.searchIndex}
                    open={search}
                    searchCount={searchState.scrollLimit}
                    onTextChange={searchTextChanged}
                    activateSearch={openSearch}
                    exitSearch={exitSearch}
                    scrollRecent={nextSearchItem}
                    scrollPrev={previousSearchItem}
                  />
                ) : null}
                {accessToken && (
                  <React.Fragment>
                    <StyledIconButton padding={'0.55rem'}>
                      <div data-tip="custom" data-for={'right-menu'}>
                        <FlexContainer>
                          <Popper
                            id={'right-menu'}
                            place="bottom"
                            effect="solid"
                            delayHide={200}
                            type={'light'}
                            marginTop={8}
                          >
                            <Paper>
                              <Logged />
                            </Paper>
                          </Popper>
                          <CircleImage
                            name="User Avatar"
                            src={userAvatar}
                            size="32"
                          />
                          {userSettingsLoaded && (
                            <UserDetail>
                              {!userName ? email : userName}
                            </UserDetail>
                          )}
                          <ExpandMore
                            style={{
                              display: isMobileView(400) ? 'none' : 'inline',
                            }}
                          />
                        </FlexContainer>
                      </div>
                    </StyledIconButton>
                    <StyledIconButton
                      padding={isMobileView(400) ? '7px' : '0.95rem'}
                    >
                      <div data-tip="custom" data-for={'right-menu-create'}>
                        <Popper
                          id={'right-menu-create'}
                          place="bottom"
                          effect="solid"
                          delayHide={200}
                          type={'light'}
                          offset={{ top: -15 }}
                        >
                          <Paper>
                            <Link to="/skillWizard">
                              <MenuItem>
                                <ListItemIcon>
                                  <Add />
                                </ListItemIcon>
                                <ListItemText>
                                  <Translate text="Create Skill" />
                                </ListItemText>
                              </MenuItem>
                            </Link>
                            <Link to="/botWizard">
                              <MenuItem>
                                <ListItemIcon>
                                  <Person />
                                </ListItemIcon>
                                <ListItemText>
                                  <Translate text="Create Bot" />
                                </ListItemText>
                              </MenuItem>
                            </Link>
                            <Link to="/mydevices">
                              <MenuItem>
                                <ListItemIcon>
                                  <Devices />
                                </ListItemIcon>
                                <ListItemText>
                                  <Translate text="Add Device" />
                                </ListItemText>
                              </MenuItem>
                            </Link>
                          </Paper>
                        </Popper>
                        {isMobileView(400) ? (
                          <Add
                            style={{
                              marginLeft: '5px',
                              color: '#fff',
                            }}
                          />
                        ) : (
                          <CreateDetail style={{ marginLeft: '20px' }}>
                            Create
                          </CreateDetail>
                        )}
                      </div>
                    </StyledIconButton>
                    <ToolTip title="Dashboard">
                      <IconButton
                        color="inherit"
                        onClick={() => history.push('/dashboard')}
                        style={{ padding: '7px' }}
                      >
                        <Dashboard />
                      </IconButton>
                    </ToolTip>
                  </React.Fragment>
                )}
                {accessToken ? null : (
                  <MenuItem onClick={this.handleLogin}>
                    <ListItemText>
                      <Translate text="Login" />
                    </ListItemText>
                  </MenuItem>
                )}
                <ToolTip title="Chat with Susi AI">
                  <IconButton
                    color="inherit"
                    onClick={
                      isMobileView(500) ? this.openFullScreen : this.openPreview
                    }
                    style={{ padding: '7px' }}
                  >
                    <Chat />
                  </IconButton>
                </ToolTip>

                <div data-tip="custom" data-for={'right-menu-about'}>
                  <Popper
                    id={'right-menu-about'}
                    place="bottom"
                    effect="solid"
                    delayHide={200}
                    type={'light'}
                  >
                    <Paper>
                      <Link to="/about">
                        <MenuItem>
                          <ListItemText>
                            <Translate text="About" />
                          </ListItemText>
                        </MenuItem>
                      </Link>
                      <Link to="/support">
                        <MenuItem>
                          <ListItemText>
                            <Translate text="Support" />
                          </ListItemText>
                        </MenuItem>
                      </Link>
                    </Paper>
                  </Popper>
                  <Link to="/about">
                    <IconButton
                      aria-haspopup="true"
                      style={{
                        color: 'white',
                        paddingRight: '15px',
                        paddingLeft: '7px',
                      }}
                    >
                      <ContactSupportIcon />
                    </IconButton>
                  </Link>
                </div>
              </TopRightMenuContainer>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      </div>
    );
  }
}

function mapStateToProps(store) {
  const { email, accessToken, isAdmin, avatarImgThumbnail } = store.app;
  const { userName, userSettingsLoaded } = store.settings;
  return {
    email,
    accessToken,
    userName,
    userSettingsLoaded,
    isAdmin,
    avatarImgThumbnail,
    ...store.skills,
    ...store.ui,
    testSkillExampleKey: store.skill.testSkillExampleKey,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      { ...skillsAction, ...uiActions, ...skillAction },
      dispatch,
    ),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(NavigationBar),
);

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ISO6391 from 'iso-639-1';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Translate from '../Translate/Translate.react';
import CircleImage from '../shared/CircleImage';
import { bindActionCreators } from 'redux';
import uiActions from '../../redux/actions/ui';
import skillsAction from '../../redux/actions/skills';
import skillAction from '../../redux/actions/skill';
import Link from '../shared/Link';
import Settings from '@material-ui/icons/Settings';
import Exit from '@material-ui/icons/ExitToApp';
import Dashboard from '@material-ui/icons/Dashboard';
import susiWhite from '../../images/susi-logo-white.png';
import Slide from '@material-ui/core/Slide';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Popper from './Popper';
import ExpandingSearchField from '../ChatApp/SearchField.react';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import Chat from '@material-ui/icons/Chat';
import { FlexContainer } from '../shared/Container';
import ListIcon from '@material-ui/icons/List';
import SearchBar from './SearchBar';
import _ from 'lodash';
import LanguageIcon from '@material-ui/icons/Language';
import DashIcon from '@material-ui/icons/Remove';
import susiFevicon from '../../images/favicon.png';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import {
  LanguageSelect,
  UserDetail,
  CreateDetail,
  StyledIconButton,
  ExpandMore,
  SusiLogo,
  TopRightMenuContainer,
  SusiLogoContainer,
  Toolbar,
} from './Styles';

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
    chatBubble: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchType: this.props.searchType,
      searchSelectWidth: this.getSelectMenuWidth(this.props.searchType),
      showSearchBar: window.innerWidth > 900,
    };
  }

  openFullScreen = () => {
    const { actions } = this.props;
    actions.handleChatBubble({
      chatBubble: 'minimised',
    });
    actions.handleTestSkillExample({ testSkillExampleKey: -1 });
    actions.openModal({
      modalType: 'chatBubble',
      fullScreenChat: true,
    });
  };

  toggleChat = () => {
    const { actions, chatBubble } = this.props;
    actions.handleChatBubble({
      chatBubble: chatBubble === 'full' ? 'bubble' : 'full',
    });
    actions.handleTestSkillExample({ testSkillExampleKey: -1 });
  };

  handleLogin = () => {
    const { actions } = this.props;
    actions.openModal({ modalType: 'login' });
  };

  handleSearchTypeChange = e => {
    const { actions, searchQuery } = this.props;
    const { value: searchType } = e.target;
    actions.setSearchFilter({ searchType }).then(() => {
      this.setState({
        searchSelectWidth: this.getSelectMenuWidth(searchType),
      });
      if (searchQuery !== '') {
        this.loadCards();
      }
    });
  };

  handleSearch = value => {
    if (typeof value !== 'string') {
      value = '';
    }
    value = value.trim();
    this.props.actions.setSearchFilter({ searchQuery: value }).then(() => {
      this.loadCards();
      if (value !== '') {
        this.props.history.push('/');
      }
    });
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

  handleLanguageChange = (event, index, values) => {
    localStorage.setItem('languages', event.target.value);
    this.props.actions
      .setLanguageFilter({ languageValue: event.target.value })
      .then(() => {
        if (
          this.props.routeType ||
          ['category', 'language'].includes(window.location.href.split('/')[4])
        ) {
          this.loadCards();
        } else {
          this.loadMetricsSkills();
        }
      });
  };

  loadMetricsSkills = () => {
    this.props.actions.getMetricsSkills({
      languageValue: this.props.languageValue,
    });
  };

  toggleSearchBar = () => {
    this.setState(prevState => ({ showSearchBar: !prevState.showSearchBar }));
  };

  render() {
    const {
      accessToken,
      isAdmin,
      email,
      userName,
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
    if (window.innerWidth > 900) {
      renderSusiIcon = (
        <SusiLogo marginRight={24} src={susiWhite} alt="susi-logo" />
      );
    }
    if (window.innerWidth < 900 && !showSearchBar) {
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
          {window.innerWidth < 900 && (
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
              <TopRightMenuContainer>
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
                          <UserDetail>
                            {!userName ? email : userName}
                          </UserDetail>
                          <ExpandMore />
                        </FlexContainer>
                      </div>
                    </StyledIconButton>
                    <StyledIconButton padding={'0.95rem'}>
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
                                <ListItemText>
                                  <Translate text="Create Skill" />
                                </ListItemText>
                              </MenuItem>
                            </Link>
                            <Link to="/botWizard">
                              <MenuItem>
                                <ListItemText>
                                  <Translate text="Create Bot" />
                                </ListItemText>
                              </MenuItem>
                            </Link>
                          </Paper>
                        </Popper>
                        <CreateDetail>Create</CreateDetail>
                      </div>
                    </StyledIconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => history.push('/dashboard')}
                    >
                      <Dashboard />
                    </IconButton>
                  </React.Fragment>
                )}
                {accessToken ? null : (
                  <MenuItem onClick={this.handleLogin}>
                    <ListItemText>
                      <Translate text="Login" />
                    </ListItemText>
                  </MenuItem>
                )}
                <IconButton
                  color="inherit"
                  onClick={
                    window.innerWidth < 500
                      ? this.openFullScreen
                      : this.toggleChat
                  }
                >
                  <Chat />
                </IconButton>
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
                  <IconButton aria-haspopup="true" color="inherit">
                    <ContactSupportIcon />
                  </IconButton>
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
  const { userName } = store.settings;
  return {
    email,
    accessToken,
    userName,
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

import React from 'react';
import PropTypes from 'prop-types';
import ISO6391 from 'iso-639-1';
import _ from 'lodash';
import { Link as _Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import skillActions from '../../../redux/actions/skills';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import _FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import _ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Person from '@material-ui/icons/Person';
import ActionViewModule from '@material-ui/icons/ViewModule';
import ActionViewStream from '@material-ui/icons/ViewStream';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import NavigationArrowBack from '@material-ui/icons/ArrowBack';
import NavigationArrowForward from '@material-ui/icons/ArrowForward';
import NavigationArrowUpward from '@material-ui/icons/ArrowUpward';
import NavigationArrowDownward from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import _SearchBar from 'material-ui-search-bar';
import { scrollAnimation } from '../../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import SkillCardList from '../SkillCardList/SkillCardList';
import SkillCardGrid from '../SkillCardGrid/SkillCardGrid';
import SkillCardScrollList from '../SkillCardScrollList/SkillCardScrollList';
import SkillRating from '../SkillRating/SkillRating.js';
import isMobileView from '../../../utils/isMobileView';
import Grid from '@material-ui/core/Grid';

import { SelectedText } from '../SkillsStyle';

const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 12.5rem auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  flex: 1 0 auto;
  margin-top: 3rem;
`;

const commonFormStyles = css`
  width: 9rem;
  margin: 1rem 0.625rem 1rem 0;
  float: right;
  @media (max-width: 350px) {
    float: left;
    width: 7.5rem;
  }
  @media (max-width: 500px) {
    float: left;
  }
`;

const Link = styled(_Link)`
  color: #000;
  text-decoration: none;
  &:hover {
    color: #000;
  }
`;

const PageFormControl = styled(FormControl)`
  ${commonFormStyles};
  margin-left: 1.5rem;
  @media (max-width: 500px) {
    margin-right: 1.5rem;
  }
  @media (max-width: 400px) {
    margin-left: 0.625rem;
  }
`;

const SkillsFormControl = styled(FormControl)`
  ${commonFormStyles};
  margin-left: 0rem;
`;

const SkillRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1.5rem;
  font-size: 0.75rem;
`;

const SidebarTextStyles = css`
  min-height: 1.5rem;
  line-height: 1.5rem;
  font-size: 0.875rem;
  padding: 0 1.5rem;
`;

const FormControlLabel = styled(_FormControlLabel)`
  width: 16rem;
  padding-left: 0.5rem;
  top: 3px;
  ${SidebarTextStyles};
`;

const FilterFormControl = styled(FormControl)`
  margin: 0.4rem;
  width: 9rem;
  font-size: 0.875rem;
`;

const SearchBar = styled(_SearchBar)`
  margin: 0.5rem;
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

const ListSubheader = styled(_ListSubheader)`
  font-size: 1rem;
  font-weight: 700;
  line-height: 0.5rem;
  margin: 1rem 0;
`;

const SidebarItem = styled(MenuItem)`
  ${SidebarTextStyles}
`;

const Sidebar = styled.div`
  width: 16rem;
  display: block;
  z-index: 2;
  border-right: 1px solid #ddd;
  border-spacing: 1px;
  @media (max-width: 520px) {
    display: none;
  }
`;

const SidebarText = styled.h4`
  ${SidebarTextStyles}
`;

const SidebarLink = styled(Link)`
  color: rgba(0, 0, 0, 0.54);
  font-weight: bold;
  width: fit-content;
  cursor: pointer;
  :hover {
    color: #4285f4;
  }
`;

const PageNavigationContainer = styled.div`
  text-align: center;
  margin: 0.5rem 0;
  @media (max-width: 418px) {
    justify-content: center;
  }
`;

const MobileMenuItem = styled(MenuItem)`
  min-height: 24px;
  line-height: 24px;
  font-size: 14px;
`;

const MobileMenuContainer = styled.div`
  margin: 0 14px;
  padding: 8px;
  li {
    border-top: 1px #e7e7e7 solid;
    border-right: 1px #e7e7e7 solid;
    border-left: 1px #e7e7e7 solid;
  }
  & a:last-child li {
    border-bottom: 1px #e7e7e7 solid;
    border-radius: 0 0 5px 5px;
  }
  & a:first-child li {
    border-radius: 5px 5px 0 0;
  }
`;

const ContentContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  display: ${props => (props.display ? 'flex' : 'block')}
  align-items: center;
  justify-content: space-evenly;
`;

const RightContainer = styled.div`
  margin: 1rem 0;
  @media (max-width: 2400px) {
    width: 89%;
  }
  @media (max-width: 1900px) {
    width: 86%;
  }
  @media (max-width: 1600px) {
    width: 83.5%;
  }
  @media (max-width: 520px) {
    width: 100%;
  }
`;

const MobileBackButton = styled(Button)`
   {
    width: 70%;
    margin: 0 auto;
  }
`;

class BrowseSkill extends React.Component {
  static propTypes = {
    routeType: PropTypes.string,
    routeValue: PropTypes.string,
    actions: PropTypes.object,
    listPage: PropTypes.number,
    groups: PropTypes.array,
    languageValue: PropTypes.array,
    filterType: PropTypes.string,
    reviewed: PropTypes.bool,
    staffPicks: PropTypes.bool,
    groupValue: PropTypes.string,
    searchQuery: PropTypes.string,
    languages: PropTypes.array,
    orderBy: PropTypes.string,
    skills: PropTypes.array,
    entriesPerPage: PropTypes.number,
    ratingRefine: PropTypes.number,
    timeFilter: PropTypes.number,
    listOffset: PropTypes.number,
    viewType: PropTypes.string,
    metricSkills: PropTypes.object,
    loadingSkills: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      innerWidth: window.innerWidth,
      anchorEl: null,
    };
    this.groups = [];
  }

  componentDidMount() {
    document.title = 'SUSI.AI - Browse Skills';
    const { actions, routeType } = this.props;
    actions
      .initializeSkillData()
      .then(() => {
        this.loadLanguages('All');
        this.loadGroups();
      })
      .catch(error => {
        actions.initializeSkillData();
      });

    if (
      routeType ||
      ['category', 'language'].includes(window.location.href.split('/')[4])
    ) {
      this.loadCards();
    } else {
      this.loadMetricsSkills();
    }
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      innerWidth: window.innerWidth,
    });
  };

  // FilterChange
  handleFilterChange = (event, index, value) => {
    this.props.actions
      .setFilterType({ filterType: event.target.value })
      .then(() => this.loadCards());
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

  handleEntriesPerPageChange = (event, index, values) => {
    this.props.actions.setSkillsPerPage({ entriesPerPage: event.target.value });
  };

  handlePageChange = (event, index, value) => {
    if (event.target.value !== undefined) {
      this.props.actions.setSkillsPageNumber({ listPage: event.target.value });
    }
  };

  handleNavigationForward = () => {
    scrollAnimation(document.documentElement, 0, 200, 'vertical');
    const { listPage } = this.props;
    const newListPage = listPage + 1;
    this.props.actions.setSkillsPageNumber({ listPage: newListPage });
  };

  handleNavigationBackward = () => {
    scrollAnimation(document.documentElement, 0, 200, 'vertical');
    const { listPage } = this.props;
    const newListPage = listPage - 1;
    this.props.actions.setSkillsPageNumber({ listPage: newListPage });
  };

  handleViewChange = (event, value) => {
    this.props.actions.setSkillsViewType({ viewType: value });
  };

  handleArrivalTimeChange = value => {
    if (value) {
      this.props.actions
        .setTimeFilter({
          filterType: `creation_date&duration=${value}`,
          timeFilter: value,
        })
        .then(() => this.loadCards());
    } else {
      this.props.actions
        .setTimeFilter({ filterType: 'rating', timeFilter: null })
        .then(() => this.loadCards());
    }
  };

  handleSearch = value => {
    this.props.actions
      .setSearchFilter({ searchQuery: value })
      .then(() => this.loadCards());
  };

  loadGroups = () => {
    const { groups } = this.props;
    if (groups.length === 0) {
      this.props.actions.getGroupOptions().catch(error => {
        throw new Error('load groups action failed');
      });
    }
  };

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
    } = this.props;
    let payload = {
      groupValue: groupValue,
      language: languageValue,
      applyFilter: true,
      filterName: orderBy,
      filterType: filterType,
      showReviewedSkills: reviewed,
      showStaffPicks: staffPicks,
      searchQuery: searchQuery,
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
        searchQuery: searchQuery,
      };
    }
    this.props.actions.getSkills(payload);
  };

  loadMetricsSkills = () => {
    this.props.actions.getMetricsSkills({
      languageValue: this.props.languageValue,
    });
  };

  handleRatingRefine = ratingRefine => {
    if (this.props.skills.length === 0) {
      this.props.actions.setSkillsLoading().then(() => this.loadCards());
    }
    if (ratingRefine) {
      this.props.actions.setStarRatingFilter({ ratingRefine });
    } else {
      this.props.actions
        .setStarRatingFilter({ ratingRefine })
        .then(this.loadCards());
    }
  };

  languageMenuItems = values => {
    return this.props.languages.map(name => (
      <MenuItem
        key={name}
        checked={values && values.indexOf(name) > -1}
        value={name}
      >
        {ISO6391.getNativeName(name)
          ? ISO6391.getNativeName(name)
          : 'Universal'}
      </MenuItem>
    ));
  };

  pageMenuItems = values => {
    const { skills, entriesPerPage } = this.props;
    let menuItems = [];
    for (let i = 1; i <= Math.ceil(skills.length / entriesPerPage); i += 1) {
      menuItems.push(i);
    }
    return menuItems.map(menuItem => (
      <MenuItem key={menuItem} value={menuItem}>
        {menuItem.toString()}
      </MenuItem>
    ));
  };

  handleOrderByChange = () => {
    const value =
      this.props.orderBy === 'ascending' ? 'descending' : 'ascending';
    this.props.actions
      .setOrderByFilter({ orderBy: value })
      .then(() => this.loadCards());
  };

  handleMenuClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const {
      languageValue,
      searchQuery,
      ratingRefine,
      timeFilter,
      skills,
      entriesPerPage,
      listPage,
      listOffset,
      staffPicks,
      reviewed,
      viewType,
      groups,
      orderBy,
      actions,
      filterType,
      loadingSkills,
    } = this.props;
    const { routeType, routeValue } = this.props;

    let isMobile = isMobileView();
    let backToHome = null;
    let renderMenu = null;
    let renderMobileMenu = null;
    if (isMobile) {
      backToHome = (
        <MobileBackButton variant="contained" color="default">
          <Link to="/skills">Back to SUSI Skills</Link>
        </MobileBackButton>
      );
      renderMobileMenu = groups.map(categoryName => {
        const linkValue = '/skills/category/' + categoryName;
        return (
          <Link to={linkValue} key={linkValue}>
            <MobileMenuItem key={categoryName} value={categoryName}>
              <span style={{ width: '90%' }}>{categoryName}</span>
              <ChevronRight style={{ top: -8 }} />
            </MobileMenuItem>
          </Link>
        );
      });
    }
    if (!isMobile) {
      renderMenu = groups.map(categoryName => {
        const linkValue = '/skills/category/' + categoryName;
        return (
          <Link to={linkValue} key={linkValue}>
            <SidebarItem key={categoryName} value={categoryName}>
              {categoryName}
            </SidebarItem>
          </Link>
        );
      });
    }

    let metricsHidden =
      routeType || searchQuery.length > 0 || ratingRefine || timeFilter;

    let renderSkillCount = '';
    if (skills.length > 0) {
      renderSkillCount = (
        <div
          style={{
            display: 'flex',
          }}
        >
          {listOffset + 1}-
          {listOffset + entriesPerPage > skills.length
            ? skills.length
            : listOffset + entriesPerPage}{' '}
          out of {skills.length} result(s) for&nbsp;
          <b>
            <SidebarLink to="/skills">SUSI Skills</SidebarLink>
          </b>
          {routeValue && (
            <div style={{ display: 'flex' }}>
              :&nbsp;
              <div style={{ color: '#4286f4', fontWeight: 'bold' }}>
                {routeValue}
              </div>
            </div>
          )}
          {searchQuery.length > 0 && (
            <div style={{ display: 'flex' }}>
              :&nbsp;
              <div style={{ color: '#4286f4', fontWeight: 'bold' }}>
                &quot;{searchQuery}&quot;
              </div>
            </div>
          )}
          {ratingRefine > 0 && (
            <div style={{ display: 'flex' }}>
              :&nbsp;
              <div style={{ color: '#4286f4', fontWeight: 'bold' }}>
                {ratingRefine} Stars & Up
              </div>
            </div>
          )}
          {timeFilter > 0 && (
            <div style={{ display: 'flex' }}>
              :&nbsp;
              <div style={{ fontWeight: 'bold' }}>Last {timeFilter} days</div>
            </div>
          )}
        </div>
      );
    } else if (searchQuery.length > 0) {
      renderSkillCount = (
        <div style={{ padding: '10px' }}>
          <h2 style={{ fontWeight: '400' }}>
            Your search <b>&quot;{searchQuery}&quot;</b> did not match any
            skills.
          </h2>
          <h3 style={{ margin: '15px 0 10px 0' }}>Try something like</h3>
          <ul style={{ listStyle: 'inside' }}>
            <li>Using more general terms</li>
            <li>Checking your spelling</li>
          </ul>
        </div>
      );
    } else {
      renderSkillCount = (
        <div>
          No result found for{' '}
          <SidebarLink to="/skills">SUSI Skills:</SidebarLink>
          {routeValue && (
            <span style={{ color: '#4286f4', fontWeight: 'bold' }}>
              {routeValue}
            </span>
          )}
        </div>
      );
    }

    let renderCardScrollList = '';
    renderCardScrollList = !metricsHidden && !routeType && (
      <SkillCardScrollList />
    );

    let renderOrderBy = '';

    renderOrderBy =
      orderBy === 'ascending' ? (
        <NavigationArrowUpward />
      ) : (
        <NavigationArrowDownward />
      );

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Container>
        <Sidebar>
          <div>
            <Button
              aria-owns={open ? 'render-props-menu' : undefined}
              aria-haspopup="true"
              onClick={this.handleMenuClick}
              variant="contained"
              color="primary"
              style={{ margin: '1rem 1rem 0', padding: '10px 20px' }}
            >
              <Add /> Create
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleMenuClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MenuList disableListWrap={true}>
                <Link to="/skills/skillCreator">
                  <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText>Create a Skill</ListItemText>
                  </MenuItem>
                </Link>
                <Link to="/skills/botbuilder">
                  <MenuItem onClick={this.handleMenuClose}>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText>Create Skill bot</ListItemText>
                  </MenuItem>
                </Link>
              </MenuList>
            </Menu>
          </div>
          <Paper style={{ boxShadow: 'none' }}>
            <MenuList>
              {timeFilter ? (
                <div>
                  <ListSubheader>
                    <SidebarLink
                      onClick={() => this.handleArrivalTimeChange(null)}
                    >
                      {'< Any release'}
                    </SidebarLink>
                  </ListSubheader>
                  <SelectedText>{`Last ${timeFilter} Days`}</SelectedText>
                </div>
              ) : (
                <ListSubheader>New Arrivals</ListSubheader>
              )}
              {!timeFilter && (
                <SidebarItem
                  value="creation_date&duration=7"
                  onClick={() => this.handleArrivalTimeChange(7)}
                >
                  Last 7 Days
                </SidebarItem>
              )}
              {!timeFilter && (
                <SidebarItem
                  value="creation_date&duration=30"
                  onClick={() => this.handleArrivalTimeChange(30)}
                >
                  Last 30 Days
                </SidebarItem>
              )}
              {!timeFilter && (
                <SidebarItem
                  value="creation_date&duration=90"
                  onClick={() => this.handleArrivalTimeChange(90)}
                >
                  Last 90 Days
                </SidebarItem>
              )}
              <Divider style={{ marginLeft: '16px', marginRight: '16px' }} />
              {routeType === 'category' ? (
                <div>
                  <ListSubheader>
                    <SidebarLink to="/skills">{'< SUSI Skills'}</SidebarLink>
                  </ListSubheader>
                  <SelectedText>{routeValue}</SelectedText>
                </div>
              ) : (
                <div>
                  <ListSubheader>SUSI Skills</ListSubheader>
                  {renderMenu}
                </div>
              )}
              <Divider style={{ marginLeft: '16px', marginRight: '16px' }} />
              {/* Refine by rating section*/}
              <ListSubheader>Refine by</ListSubheader>
              {metricsHidden && (
                <div
                  style={{
                    marginBottom: '12px',
                    width: '100%',
                    display: 'flex',
                    justify: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="select"
                        checked={staffPicks}
                        onChange={event => {
                          actions
                            .setStaffpickFilter({
                              staffPicks: event.target.checked,
                            })
                            .then(() => this.loadCards());
                        }}
                      />
                    }
                    label="Staff Picks"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        className="select"
                        checked={reviewed}
                        onChange={event => {
                          actions
                            .setReviewedFilter({
                              reviewed: event.target.checked,
                            })
                            .then(() => this.loadCards());
                        }}
                      />
                    }
                    label="Reviewed Skills"
                  />
                </div>
              )}
              <SidebarText>Avg. Customer Review</SidebarText>
              {ratingRefine ? (
                <ListSubheader>
                  <SidebarLink onClick={() => this.handleRatingRefine(null)}>
                    {'< Clear'}
                  </SidebarLink>
                </ListSubheader>
              ) : (
                ''
              )}
              <SkillRatingContainer>
                <SkillRating
                  handleRatingRefine={this.handleRatingRefine}
                  rating={4}
                  ratingRefine={ratingRefine}
                />
                <SkillRating
                  handleRatingRefine={this.handleRatingRefine}
                  rating={3}
                  ratingRefine={ratingRefine}
                />
                <SkillRating
                  handleRatingRefine={this.handleRatingRefine}
                  rating={2}
                  ratingRefine={ratingRefine}
                />
                <SkillRating
                  handleRatingRefine={this.handleRatingRefine}
                  rating={1}
                  ratingRefine={ratingRefine}
                />
              </SkillRatingContainer>
            </MenuList>
          </Paper>
        </Sidebar>
        <RightContainer>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={3}
            justify="space-between"
          >
            <Grid item xs={11} sm={11} md={5} lg={metricsHidden ? 7 : 8}>
              <SearchBar
                onChange={_.debounce(this.handleSearch, 500)}
                onRequestSearch={this.loadCards}
                value={searchQuery}
              />
            </Grid>
            {metricsHidden && (
              <Grid item xs={6} sm={4} md={3} lg={2}>
                <FlexContainer display={metricsHidden}>
                  {filterType !== '' && (
                    <IconButton
                      color="primary"
                      onClick={this.handleOrderByChange}
                    >
                      {renderOrderBy}
                    </IconButton>
                  )}
                  <FilterFormControl>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={filterType}
                      onChange={this.handleFilterChange}
                    >
                      <MenuItem value={'lexicographical'}>Name (A-Z)</MenuItem>
                      <MenuItem value={'rating'}>Top Rated</MenuItem>
                      <MenuItem value={'creation_date'}>Newly Created</MenuItem>
                      <MenuItem value={'modified_date'}>
                        Recently updated
                      </MenuItem>
                      <MenuItem value={'feedback'}>Feedback Count</MenuItem>
                      <MenuItem value={'usage&duration=7'}>
                        This Week Usage
                      </MenuItem>
                      <MenuItem value={'usage&duration=30'}>
                        This Month Usage
                      </MenuItem>
                    </Select>
                  </FilterFormControl>
                </FlexContainer>
              </Grid>
            )}
            <Grid item xs={6} sm={6} md={3} lg={3}>
              <FlexContainer display={metricsHidden}>
                <FilterFormControl>
                  <InputLabel>Languages</InputLabel>
                  <Select
                    value={languageValue}
                    onChange={this.handleLanguageChange}
                    multiple
                  >
                    {this.languageMenuItems(languageValue)}
                  </Select>
                </FilterFormControl>
                {metricsHidden && (
                  <RadioGroup
                    defaultValue="list"
                    value={viewType}
                    onChange={this.handleViewChange}
                  >
                    <Radio
                      value="list"
                      style={{ width: 'fit-content', padding: '0px' }}
                      checkedIcon={
                        <ActionViewStream style={{ fill: '#4285f4' }} />
                      }
                      icon={<ActionViewStream style={{ fill: '#e0e0e0' }} />}
                    />
                    <Radio
                      value="grid"
                      style={{ width: 'fit-content', padding: '0px' }}
                      checkedIcon={
                        <ActionViewModule style={{ fill: '#4285f4' }} />
                      }
                      icon={<ActionViewModule style={{ fill: '#e0e0e0' }} />}
                    />
                  </RadioGroup>
                )}
              </FlexContainer>
            </Grid>
          </Grid>
          {loadingSkills && (
            <LoaderContainer>
              <div className="center">
                <CircularProgress size={62} color="primary" />
                <h4>Loading</h4>
              </div>
            </LoaderContainer>
          )}
          {!loadingSkills ? (
            <ContentContainer>
              {metricsHidden ? (
                <div>
                  <Grid
                    container
                    spacing={3}
                    direction={isMobile ? 'column-reverse' : 'row'}
                  >
                    <Grid
                      item
                      alignItems="center"
                      sm={6}
                      style={{
                        textAlign: 'center',
                        padding: isMobile ? '10px' : '30px 25px 0',
                        fontSize: isMobile ? '14px' : '16px',
                      }}
                    >
                      {renderSkillCount}
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      alignItems="flex-end"
                      style={{ alignItems: isMobile ? 'center' : 'left' }}
                    >
                      {skills.length > 10 && (
                        <div>
                          <PageFormControl>
                            <InputLabel>Page</InputLabel>
                            <Select
                              value={listPage}
                              onChange={this.handlePageChange}
                            >
                              {this.pageMenuItems()}
                            </Select>
                          </PageFormControl>
                          <SkillsFormControl>
                            <InputLabel>Skills per page</InputLabel>
                            <Select
                              value={entriesPerPage}
                              onChange={this.handleEntriesPerPageChange}
                            >
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={20}>20</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                            </Select>
                          </SkillsFormControl>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                  <div>
                    {viewType === 'list' ? (
                      <SkillCardList />
                    ) : (
                      <SkillCardGrid />
                    )}
                  </div>
                  {skills.length > 10 && (
                    <PageNavigationContainer>
                      <div>
                        Page: {listPage} out of{' '}
                        {Math.ceil(skills.length / entriesPerPage)}
                      </div>
                      <Fab
                        disabled={listPage === 1}
                        color="primary"
                        style={{ marginRight: '15px' }}
                        onClick={this.handleNavigationBackward}
                      >
                        <NavigationArrowBack />
                      </Fab>
                      <Fab
                        disabled={
                          listPage === Math.ceil(skills.length / entriesPerPage)
                        }
                        color="primary"
                        onClick={this.handleNavigationForward}
                      >
                        <NavigationArrowForward />
                      </Fab>
                    </PageNavigationContainer>
                  )}
                </div>
              ) : (
                ''
              )}
              <div>{renderCardScrollList}</div>
              {/* Check if mobile view is currently active*/}
              {routeType === 'category' ? (
                backToHome
              ) : (
                <MobileMenuContainer>{renderMobileMenu}</MobileMenuContainer>
              )}
            </ContentContainer>
          ) : null}
        </RightContainer>
      </Container>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.skills,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(skillActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrowseSkill);

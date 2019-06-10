import React from 'react';
import PropTypes from 'prop-types';
import styles from './SkillStyle';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
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
import SearchBar from 'material-ui-search-bar';
import { scrollAnimation } from '../../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import SkillCardList from '../SkillCardList/SkillCardList';
import SkillCardGrid from '../SkillCardGrid/SkillCardGrid';
import SkillCardScrollList from '../SkillCardScrollList/SkillCardScrollList';
import SkillRating from '../SkillRating/SkillRating.js';
import isMobileView from '../../../utils/isMobileView';
import Grid from '@material-ui/core/Grid';
import './custom.css';

const commonFormStyles = css`
  width: 145px;
  margin-top: 15px;
  margin-right: 10px;
  margin-bottom: 15px;
  float: right;

  @media (max-width: 350px) {
    float: left;
    width: 120px;
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
  margin-left: 25px;
  @media (max-width: 500px) {
    margin-right: 25px;
  }
  @media (max-width: 400px) {
    margin-left: 10px;
  }
`;

const SkillsFormControl = styled(FormControl)`
  ${commonFormStyles};
  margin-left: 0rem;
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
    console.log(this.props.filterType);
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
    const { innerWidth } = this.state;

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
    } = this.props;
    const { routeType, routeValue } = this.props;

    let isMobile = isMobileView();

    let sidebarStyle = styles.sidebar;
    let topBarStyle = styles.topBar;
    sidebarStyle = isMobile
      ? { ...sidebarStyle, display: 'none' }
      : { ...sidebarStyle, display: 'block' };
    topBarStyle = isMobile
      ? { ...topBarStyle, flexDirection: 'column' }
      : { ...topBarStyle, flexDirection: 'row' };
    let backToHome = null;
    let renderMenu = null;
    let renderMobileMenu = null;
    if (isMobile) {
      backToHome = (
        <MenuItem
          value="Back to SUSI Skills"
          key="Back to SUSI Skills"
          primaryText="Back to SUSI Skills"
          containerElement={<Link to="/skills" />}
          style={{ minHeight: '32px', textAlign: 'center', lineHeight: '32px' }}
        />
      );
      renderMobileMenu = this.props.groups.map(categoryName => {
        const linkValue = '/skills/category/' + categoryName;
        return (
          <Link to={linkValue} key={linkValue}>
            <MenuItem
              key={categoryName}
              value={categoryName}
              style={styles.mobileMenuItem}
            >
              <span style={{ width: '90%' }}>{categoryName}</span>
              <ChevronRight style={{ top: -8 }} />
            </MenuItem>
          </Link>
        );
      });
    }
    if (!isMobile) {
      renderMenu = this.props.groups.map(categoryName => {
        const linkValue = '/skills/category/' + categoryName;
        return (
          <Link to={linkValue} key={linkValue}>
            <MenuItem
              key={categoryName}
              value={categoryName}
              style={styles.categorySidebarMenuItem}
            >
              {categoryName}
            </MenuItem>
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
            <Link to="/skills">
              <div className="susi-skills">SUSI Skills</div>
            </Link>
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
          <b>
            <Link to="/skills">
              <span className="susi-skills">SUSI Skills: </span>
            </Link>
          </b>
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
      this.props.orderBy === 'ascending' ? (
        <NavigationArrowUpward />
      ) : (
        <NavigationArrowDownward />
      );

    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div style={styles.browseSkillRoot}>
        <div style={styles.main}>
          <div style={sidebarStyle}>
            <div style={styles.newSkillBtn}>
              <Button
                aria-owns={open ? 'render-props-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleMenuClick}
                variant="contained"
                color="primary"
                style={styles.newSkillBtn}
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
                      <ListItemText inset primary="Create a Skill" />
                    </MenuItem>
                  </Link>
                  <Link to="/skills/botbuilder">
                    <MenuItem onClick={this.handleMenuClose}>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText inset primary="Create Skill bot" />
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            </div>
            <Paper style={{ boxShadow: 'none' }}>
              <MenuList>
                {timeFilter ? (
                  <div className="category-sidebar-section">
                    <div
                      className="index-link-sidebar"
                      onClick={() => this.handleArrivalTimeChange(null)}
                    >
                      {'< Any release'}
                    </div>
                    <div style={styles.selectedFilterStyle}>
                      {`Last ${timeFilter} Days`}
                    </div>
                  </div>
                ) : (
                  <ListSubheader style={styles.sidebarSubheader}>
                    New Arrivals
                  </ListSubheader>
                )}
                {!timeFilter && (
                  <MenuItem
                    value="creation_date&duration=7"
                    onClick={() => this.handleArrivalTimeChange(7)}
                    style={styles.sidebarMenuItem}
                  >
                    Last 7 Days
                  </MenuItem>
                )}
                {!timeFilter && (
                  <MenuItem
                    value="creation_date&duration=30"
                    onClick={() => this.handleArrivalTimeChange(30)}
                    style={styles.sidebarMenuItem}
                  >
                    Last 30 Days
                  </MenuItem>
                )}
                {!timeFilter && (
                  <MenuItem
                    value="creation_date&duration=90"
                    onClick={() => this.handleArrivalTimeChange(90)}
                    style={styles.sidebarMenuItem}
                  >
                    Last 90 Days
                  </MenuItem>
                )}
                <Divider style={{ marginLeft: '16px', marginRight: '16px' }} />

                {routeType === 'category' ? (
                  <div className="category-sidebar-section">
                    <Link to="/skills">
                      <div
                        onClick={() =>
                          this.props.actions.setCategoryFilter({
                            groupValue: 'All',
                          })
                        }
                        className="index-link-sidebar"
                      >
                        {'< SUSI Skills'}
                      </div>
                    </Link>
                    <div style={styles.selectedFilterStyle}>{routeValue}</div>
                  </div>
                ) : (
                  <div>
                    <ListSubheader style={styles.sidebarSubheader}>
                      SUSI Skills
                    </ListSubheader>
                    {renderMenu}
                  </div>
                )}

                <Divider style={{ marginLeft: '16px', marginRight: '16px' }} />
                {/* Refine by rating section*/}
                <ListSubheader style={styles.sidebarSubheader}>
                  Refine by
                </ListSubheader>
                {metricsHidden && (
                  <div
                    style={{
                      marginBottom: '12px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          className="select"
                          checked={staffPicks}
                          onChange={event => {
                            this.props.actions
                              .setStaffpickFilter({
                                staffPicks: event.target.checked,
                              })
                              .then(() => this.loadCards());
                          }}
                        />
                      }
                      label="Staff Picks"
                      labelPosition="end"
                      style={styles.checkboxStyle}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          className="select"
                          checked={reviewed}
                          onChange={event => {
                            this.props.actions
                              .setReviewedFilter({
                                reviewed: event.target.checked,
                              })
                              .then(() => this.loadCards());
                          }}
                        />
                      }
                      label="Show Only Reviewed Skills"
                      labelPosition="end"
                      style={styles.checkboxStyle}
                    />
                  </div>
                )}

                <h4
                  style={{
                    marginLeft: '24px',
                    marginBottom: '4px',
                    fontSize: 14,
                  }}
                >
                  Avg. Customer Review
                </h4>
                {ratingRefine ? (
                  <div
                    className="clear-button"
                    style={styles.clearButton}
                    onClick={() => this.handleRatingRefine(null)}
                  >
                    {'< Clear'}
                  </div>
                ) : (
                  ''
                )}
                <div style={styles.starRefine}>
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
                </div>
              </MenuList>
            </Paper>
          </div>
          <div style={styles.home}>
            <div style={topBarStyle} className="top-bar">
              <div style={styles.searchBar} className="search-bar">
                <SearchBar
                  onChange={_.debounce(this.handleSearch, 500)}
                  onRequestSearch={this.loadCards}
                  style={{
                    marginTop: '17px',
                  }}
                  value={searchQuery}
                />
              </div>
              <div style={{ display: 'flex', textAlign: 'center' }}>
                {metricsHidden && (
                  <div style={styles.sortBy}>
                    {this.props.filterType !== '' && (
                      <IconButton
                        color="primary"
                        onClick={this.handleOrderByChange}
                      >
                        {renderOrderBy}
                      </IconButton>
                    )}
                    <FormControl style={styles.selection} className="select">
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={this.props.filterType}
                        onChange={this.handleFilterChange}
                      >
                        <MenuItem value={'lexicographical'}>
                          Name (A-Z)
                        </MenuItem>
                        <MenuItem value={'rating'}>Top Rated</MenuItem>
                        <MenuItem value={'creation_date'}>
                          Newly Created
                        </MenuItem>
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
                    </FormControl>
                  </div>
                )}
                <FormControl
                  style={{ ...styles.selection, marginTop: '10px' }}
                  className="select"
                >
                  <InputLabel>Languages</InputLabel>
                  <Select
                    value={[...languageValue]}
                    onChange={this.handleLanguageChange}
                    multiple={true}
                  >
                    {this.languageMenuItems(languageValue)}
                  </Select>
                </FormControl>
              </div>
              {metricsHidden && (
                <RadioGroup
                  name="gender1"
                  defaultValue="list"
                  value={viewType}
                  onChange={this.handleViewChange}
                  style={
                    innerWidth < 430
                      ? {
                          right: 12,
                          position: 'absolute',
                          top: isMobile ? 220 : 216,
                          display: 'flex',
                        }
                      : { display: 'flex', marginTop: 34, flexDirection: 'row' }
                  }
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
            </div>
            {this.props.loadingSkills && (
              <div>
                <h1 style={styles.loader}>
                  <div className="center">
                    <CircularProgress size={62} color="primary" />
                    <h4>Loading</h4>
                  </div>
                </h1>
              </div>
            )}

            {!this.props.loadingSkills ? (
              <div style={styles.container}>
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
                          padding: isMobile ? '10px' : '25px',
                          fontSize: isMobile ? '14px' : '16px',
                        }}
                      >
                        {renderSkillCount}
                      </Grid>
                      <Grid
                        item
                        sm={6}
                        alignContent="flex-end"
                        style={{ alignItems: isMobile ? 'center' : 'left' }}
                      >
                        {skills.length > 10 && (
                          <div>
                            <PageFormControl>
                              <InputLabel>Page</InputLabel>
                              <Select
                                value={this.props.listPage}
                                onChange={this.handlePageChange}
                              >
                                {this.pageMenuItems()}
                              </Select>
                            </PageFormControl>
                            <SkillsFormControl>
                              <InputLabel>Skills per page</InputLabel>
                              <Select
                                value={this.props.entriesPerPage}
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
                      <div className="pageNavigation">
                        <div className="pagination-test">
                          Page: {listPage} out of{' '}
                          {Math.ceil(skills.length / entriesPerPage)}
                        </div>
                        <Fab
                          disabled={listPage === 1}
                          style={{ marginRight: '15px' }}
                          backgroundColor={'#4285f4'}
                          onClick={this.handleNavigationBackward}
                        >
                          <NavigationArrowBack />
                        </Fab>
                        <Fab
                          disabled={
                            listPage ===
                            Math.ceil(skills.length / entriesPerPage)
                          }
                          backgroundColor={'#4285f4'}
                          onClick={this.handleNavigationForward}
                        >
                          <NavigationArrowForward />
                        </Fab>
                      </div>
                    )}
                  </div>
                ) : (
                  ''
                )}
                <div>{renderCardScrollList}</div>
                {/* Check if mobile view is currently active*/}
                <div className="category-mobile-section">
                  {routeType === 'category' ? backToHome : renderMobileMenu}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
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

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link as _Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import SkillLoader from './skillLoader';
import skillActions from '../../../redux/actions/skills';
import uiActions from '../../../redux/actions/ui';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '../../shared/Select';
import _FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '../../shared/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import _ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import _RadioGroup from '@material-ui/core/RadioGroup';
import _Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Devices from '@material-ui/icons/Devices';
import Person from '@material-ui/icons/Person';
import _ActionViewModule from '@material-ui/icons/ViewModule';
import _ActionViewStream from '@material-ui/icons/ViewStream';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Fab from '@material-ui/core/Fab';
import NavigationArrowBack from '@material-ui/icons/ArrowBack';
import NavigationArrowForward from '@material-ui/icons/ArrowForward';
import NavigationArrowUpward from '@material-ui/icons/ArrowUpward';
import NavigationArrowDownward from '@material-ui/icons/ArrowDownward';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import SideDrawer from './SideDrawer';
import SkillCardList from '../SkillCardList/SkillCardList';
import SkillCardGrid from '../SkillCardGrid/SkillCardGrid';
import SkillCardScrollList from '../SkillCardScrollList/SkillCardScrollList';
import SkillRating from '../SkillRating/SkillRating.js';
import isMobileView from '../../../utils/isMobileView';
import Grid from '@material-ui/core/Grid';
import pluralize from 'pluralize';
import SkillSlideshow from '../SkillSlideshow';
import { SelectedText } from '../SkillsStyle';
import appendQueryString from '../../../utils/appendQueryString';

const List = styled.div`
  display: flex;
  justify-content: center;
  text-align-last: left;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
  flex: 1 0 auto;
  margin-top: 3rem;
`;

const Button = styled(_Button)`
  width: 10rem;
`;

const Link = styled(_Link)`
  color: #000;
  text-decoration: none;
  &:hover {
    color: #000;
  }
`;

const NoSkillFound = styled.div`
  display: block;
  margin: 0 auto;
  padding: 10px;
  text-align: center;
`;

const SkillsFormControl = styled(FormControl)`
  width: 6.8rem;
  margin: 1rem 0.625rem 1rem 0;
  float: right;
  @media (max-width: 350px) {
    float: left;
    width: 7.5rem;
  }
  @media (max-width: 550px) {
    float: left;
    width: 8rem;
    margin-right: 0rem;
  }
`;

const SkillRatingContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 0.4rem 2.5rem 0.4rem 0.4rem;
  min-width: 9rem;
  font-size: 0.875rem;
  @media (max-width: 550px) {
    margin: 0.4rem 1.5rem 0.4rem 0.4rem;
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
  width: 15%;
  display: block;
  z-index: 2;
  flex: 1 1 0;
  border-right: 1px solid #ddd;
  border-spacing: 1px;
  @media (max-width: 960px) {
    display: none;
  }
`;

const SidebarText = styled.h4`
  ${SidebarTextStyles}
`;

const SidebarLink = styled(Link)`
  color: rgba(0, 0, 0, 0.54);
  font-weight: bold;
  border: none;
  padding: 0px;
  outline: none;
  width: fit-content;

  font-size: 1rem;
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
  color: ${(props) => (props.color ? props.color : null)};
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
    border-bottom: 1px #e7e7e7 solid;
  }
  & a:last-child li {
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
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  margin: 1rem 0;
  flex: 1 1 0;
  width: 85%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileBackButton = styled(Button)`
  width: 70%;
  margin: 0 auto;
`;

const commonListIconStyles = css`
  font-size: 50px;
  fill: ${(props) => (props['is-active'] ? '#4285f4' : '#e0e0e0')};
  @media (max-width: 1260px) {
    font-size: 30px;
  }
`;

const ActionViewModule = styled(_ActionViewModule)`
  ${commonListIconStyles}
`;

const ActionViewStream = styled(_ActionViewStream)`
  ${commonListIconStyles}
`;

const RadioGroup = styled(_RadioGroup)`
  margin-top: 1.1rem;
  @media (max-width: 550px) {
    margin: 0rem;
  }
`;

const styles = (theme) => ({
  ['@media (max-width:960px)']: {
    setNone: {
      display: 'none',
    },
  },
  correctWidth: {
    position: 'fixed',
    overflowY: 'scroll',
    maxHeight: '75vh',
    minWidth: '20%',
    overflowX: 'hidden',
  },
  ['@media (max-height:800px)']: {
    correctWidth: {
      maxHeight: '71vh',
    },
  },
  ['@media (max-height:660px)']: {
    correctWidth: {
      maxHeight: '65vh',
    },
  },
});

const params = new URLSearchParams(window.location.search);

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
    searchType: PropTypes.array,
    orderBy: PropTypes.string,
    skills: PropTypes.array,
    entriesPerPage: PropTypes.number,
    ratingRefine: PropTypes.number,
    timeFilter: PropTypes.number,
    listOffset: PropTypes.number,
    viewType: PropTypes.string,
    metricSkills: PropTypes.object,
    loadingSkills: PropTypes.bool,
    history: PropTypes.object,
    accessToken: PropTypes.string,
    location: PropTypes.object,
  };

  state = {
    innerWidth: window.innerWidth,
    open: false,
  };
  groups = [];

  initStore = () => {
    const { actions } = this.props;
    let obj = {};
    if (params.has('duration')) {
      const value = params.get('duration');
      obj = {
        ...obj,
        filterType: `&creation_date&duration=${value}`,
        timeFilter: parseFloat(value),
      };
    }
    if (params.has('rating_refine')) {
      actions.setStarRatingFilter({
        ratingRefine: params.get('rating_refine'),
      });
    }
    if (params.has('sort_by')) {
      obj = { ...obj, filterType: params.get('sort_by') };
    }
    if (params.has('order_by')) {
      obj = { ...obj, orderBy: params.get('order_by') };
    }
    if (params.has('staff_picks')) {
      obj = { ...obj, staffPicks: params.get('staff_picks') === 'true' };
    }
    if (params.has('reviewed')) {
      obj = { ...obj, reviewed: params.get('reviewed') === 'true' };
    }
    if (params.has('view_type')) {
      obj = { ...obj, viewType: params.get('view_type') };
    }
    return obj;
  };

  async componentDidMount() {
    // Initialize store based on query params
    const obj = this.initStore();
    const { actions, routeType } = this.props;
    document.title = 'SUSI.AI - Browse Skills';
    try {
      await actions.initializeSkillData(obj);
      this.loadGroups();
      if (
        routeType ||
        ['category', 'language'].includes(window.location.href.split('/')[4])
      ) {
        this.loadCards();
      } else {
        this.loadLanguages('All');
        this.loadMetricsSkills();
      }
    } catch (error) {
      actions.initializeSkillData(obj);
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
  handleFilterChange = async (event) => {
    const { value } = event.target;
    const { location, history, actions } = this.props;
    appendQueryString(location, history, 'sort_by', value);
    await actions.setFilterType({ filterType: value });
    if (value === 'lexicographical') {
      await actions.setOrderByFilter({ orderBy: 'ascending' });
    } else {
      await actions.setOrderByFilter({ orderBy: 'descending' });
    }
    this.loadCards();
  };

  handleEntriesPerPageChange = (event) => {
    const { actions } = this.props;
    const { value } = event.target;
    actions.setSkillsPerPage({ entriesPerPage: value });
  };

  handlePageChange = (event, index, value) => {
    if (event.target.value !== undefined) {
      this.props.actions.setSkillsPageNumber({ listPage: event.target.value });
    }
  };

  handleNavigationForward = () => {
    const { listPage, actions } = this.props;
    const newListPage = listPage + 1;
    actions.setSkillsPageNumber({ listPage: newListPage });
  };

  handleNavigationBackward = () => {
    const { listPage, actions } = this.props;
    const newListPage = listPage - 1;
    actions.setSkillsPageNumber({ listPage: newListPage });
  };

  handleViewChange = (event, value) => {
    const { actions, history, location } = this.props;
    appendQueryString(location, history, 'view_type', value);
    actions.setSkillsViewType({ viewType: value });
  };

  handleArrivalTimeChange = async (value) => {
    const { actions, history, location } = this.props;
    if (value) {
      appendQueryString(location, history, 'creation_date&duration', value);
      await actions.setTimeFilter({
        filterType: `creation_date&duration=${value}`,
        timeFilter: parseFloat(value),
      });
      this.loadCards();
    } else {
      await actions.setTimeFilter({ filterType: 'rating', timeFilter: null });
      this.loadCards();
    }
  };

  loadGroups = () => {
    const { groups } = this.props;
    if (groups.length === 0) {
      this.props.actions.getGroupOptions().catch((error) => {
        console.log(error);
      });
    }
  };

  loadLanguages = (value) => {
    this.props.actions
      .getLanguageOptions({ groupValue: value })
      .catch((error) => {
        console.log(error);
      });
  };

  loadCards = () => {
    const {
      routeType,
      routeValue,
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

  loadMetricsSkills = () => {
    this.props.actions.getMetricsSkills({
      languageValue: this.props.languageValue,
    });
    window.scrollTo(0, 0);
  };

  handleRatingRefine = async (ratingRefine) => {
    const { skills = [], actions, history, location } = this.props;
    if (skills.length === 0) {
      await actions.setSkillsLoading();
      this.loadCards();
    }
    if (ratingRefine) {
      actions.setStarRatingFilter({ ratingRefine });
      appendQueryString(location, history, 'rating_refine', ratingRefine);
    } else {
      await actions.setStarRatingFilter({ ratingRefine });
      this.loadCards();
    }
  };

  pageMenuItems = (values) => {
    const { skills = [], entriesPerPage } = this.props;
    let menuItems = [];
    for (let i = 1; i <= Math.ceil(skills.length / entriesPerPage); i += 1) {
      menuItems.push(i);
    }
    return (
      menuItems &&
      Array.isArray(menuItems) &&
      menuItems.length > 0 &&
      menuItems.map((menuItem) => (
        <MenuItem key={menuItem} value={menuItem}>
          {menuItem.toString()}
        </MenuItem>
      ))
    );
  };

  handleOrderByChange = async () => {
    const { orderBy, actions, history, location } = this.props;
    const value = orderBy === 'ascending' ? 'descending' : 'ascending';
    appendQueryString(location, history, 'order_by', value);
    await actions.setOrderByFilter({ orderBy: value });
    this.loadCards();
  };

  handleReviewFilterChange = async (e) => {
    const { actions, history, location } = this.props;
    const { checked } = e.target;
    appendQueryString(location, history, 'reviewed', checked);
    await actions.setReviewedFilter({
      reviewed: checked,
    });
    this.loadCards();
  };

  handleStaffFilterChange = async (e) => {
    const { actions, history, location } = this.props;
    const { checked } = e.target;
    appendQueryString(location, history, 'staff_picks', checked);
    await actions.setStaffpickFilter({
      staffPicks: e.target.checked,
    });
    this.loadCards();
  };

  handleMenuClick = (event) => {
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  handleMenuClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  handleCreateSkillClick = (e) => {
    const { history, actions, accessToken } = this.props;
    this.handleMenuClose(e);
    if (accessToken) {
      history.push('/skillWizard');
    } else {
      actions.openModal({ modalType: 'login' });
    }
  };

  handleCreateBotClick = (e) => {
    const { history, actions, accessToken } = this.props;
    this.handleMenuClose(e);
    if (accessToken) {
      history.push('/botWizard');
    } else {
      actions.openModal({ modalType: 'login' });
    }
  };

  handleAddDeviceClick = (e) => {
    const { history, actions, accessToken } = this.props;
    this.handleMenuClose(e);
    if (accessToken) {
      history.push('/mydevices');
    } else {
      actions.openModal({ modalType: 'login' });
    }
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      searchQuery,
      ratingRefine,
      timeFilter,
      skills = [],
      entriesPerPage,
      listPage,
      listOffset,
      staffPicks,
      reviewed,
      viewType,
      groups,
      orderBy,
      filterType,
      loadingSkills,
      classes,
    } = this.props;
    const { routeType, routeValue, history } = this.props;
    let isMobile = isMobileView(960);
    let backToHome = null;
    let renderMenu = null;
    let renderMobileMenu = null;

    if (isMobile) {
      backToHome = (
        <MobileBackButton variant="contained" color="default">
          <Link to="/">Back to SUSI Skills</Link>
        </MobileBackButton>
      );
      renderMobileMenu =
        groups &&
        Array.isArray(groups) &&
        groups.length > 0 &&
        groups.map((categoryName) => {
          const linkValue = '/category/' + categoryName;
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
    renderMenu =
      groups &&
      Array.isArray(groups) &&
      groups.length > 0 &&
      groups.map((categoryName) => {
        const linkValue = '/category/' + categoryName;
        return (
          <Link to={linkValue} key={linkValue}>
            <SidebarItem key={categoryName} value={categoryName}>
              {categoryName}
            </SidebarItem>
          </Link>
        );
      });

    let metricsHidden =
      routeType || searchQuery.length > 0 || ratingRefine || timeFilter;

    let renderSkillCount = '',
      noSkillFound = '';
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
          out of {skills.length} {pluralize('result', skills.length)} for&nbsp;
          <b>
            <SidebarLink to="/">SUSI Skill</SidebarLink>
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
      noSkillFound = (
        <NoSkillFound>
          <h2 style={{ fontWeight: '400' }}>
            Your search <b>&quot;{searchQuery}&quot;</b> did not match any
            skills.
          </h2>
          <h3 style={{ margin: '15px 0 10px 0' }}>Try something like</h3>
          <List>
            <ul style={{ listStyle: 'inside' }}>
              <li>Using more general terms</li>
              <li>Checking your spelling</li>
            </ul>
          </List>
        </NoSkillFound>
      );
    } else {
      noSkillFound = (
        <NoSkillFound>
          No result found for <SidebarLink to="/">SUSI Skill</SidebarLink>
          :&nbsp;
          {routeValue && (
            <span style={{ color: '#4286f4', fontWeight: 'bold' }}>
              {routeValue}
            </span>
          )}
        </NoSkillFound>
      );
    }

    let renderCardScrollList = '';
    renderCardScrollList = !metricsHidden && !routeType && (
      <SkillCardScrollList isMobile={isMobile} history={history} />
    );
    let isSkillSearch = !metricsHidden && !routeType;
    let renderSkillSlideshow = null;
    renderSkillSlideshow = !metricsHidden && !routeType && <SkillSlideshow />;

    let renderOrderBy = '';

    renderOrderBy =
      orderBy === 'ascending' ? (
        <NavigationArrowUpward />
      ) : (
        <NavigationArrowDownward />
      );

    const renderTimeFilter = (
      <div>
        {timeFilter ? (
          <div>
            <ListSubheader>
              <SidebarLink onClick={() => this.handleArrivalTimeChange(null)}>
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
      </div>
    );
    const renderRatingsFilter = (
      <div>
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
                  onChange={this.handleStaffFilterChange}
                />
              }
              label="Staff Picks"
            />
            <FormControlLabel
              control={
                <Checkbox
                  className="select"
                  checked={reviewed}
                  onChange={this.handleReviewFilterChange}
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
          <SidebarItem>
            <SkillRating
              handleRatingRefine={this.handleRatingRefine}
              rating={4}
              ratingRefine={ratingRefine}
            />
          </SidebarItem>
          <SidebarItem>
            <SkillRating
              handleRatingRefine={this.handleRatingRefine}
              rating={3}
              ratingRefine={ratingRefine}
            />
          </SidebarItem>
          <SidebarItem>
            <SkillRating
              handleRatingRefine={this.handleRatingRefine}
              rating={2}
              ratingRefine={ratingRefine}
            />
          </SidebarItem>
          <SidebarItem>
            <SkillRating
              handleRatingRefine={this.handleRatingRefine}
              rating={1}
              ratingRefine={ratingRefine}
            />
          </SidebarItem>
        </SkillRatingContainer>
      </div>
    );
    const { open } = this.state;
    return (
      <Container style={{ maxHeight: '100%' }}>
        <Grid container>
          {/* eslint-disable-next-line react/prop-types*/}
          <Grid item xs={0} sm={0} md={3} lg={3} className={classes.setNone}>
            <Sidebar className={classes.correctWidth}>
              <div>
                <Button
                  aria-owns={open ? 'create-list-grow' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenuClick}
                  variant="contained"
                  color="primary"
                  style={{ margin: '1rem 1rem 0' }}
                  buttonRef={(node) => {
                    this.anchorEl = node;
                  }}
                >
                  <Add /> Create
                </Button>
                <Popper
                  open={open}
                  transition
                  disablePortal
                  style={{ zIndex: '2', position: 'absolute', left: '1rem' }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps} id="create-list-grow">
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleMenuClose}>
                          <MenuList>
                            <MenuItem onClick={this.handleCreateSkillClick}>
                              <ListItemIcon>
                                <Add />
                              </ListItemIcon>
                              <ListItemText>Create Skill</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={this.handleCreateBotClick}>
                              <ListItemIcon>
                                <Person />
                              </ListItemIcon>
                              <ListItemText>Create Bot</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={this.handleAddDeviceClick}>
                              <ListItemIcon>
                                <Devices />
                              </ListItemIcon>
                              <ListItemText>Add Device</ListItemText>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
              <Paper style={{ boxShadow: 'none' }}>
                <MenuList style={{ outline: 'none' }}>
                  {renderTimeFilter}

                  <Divider
                    style={{ marginLeft: '16px', marginRight: '16px' }}
                  />
                  {routeType === 'category' ? (
                    <div>
                      <ListSubheader>
                        <SidebarLink to="/">{'< SUSI Skills'}</SidebarLink>
                      </ListSubheader>
                      <SelectedText>{routeValue}</SelectedText>
                    </div>
                  ) : (
                    <div>
                      <ListSubheader>SUSI Skills</ListSubheader>
                      {renderMenu}
                    </div>
                  )}
                  <Divider
                    style={{ marginLeft: '16px', marginRight: '16px' }}
                  />
                  {/* Refine by rating section*/}
                  {renderRatingsFilter}
                </MenuList>
              </Paper>
            </Sidebar>
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9}>
            <RightContainer
              style={{
                // maxHeight: '90vh',
                overflowY: 'scroll',
                minWidth: '100%',
                overflowX: 'hidden',
              }}
            >
              {loadingSkills ? (
                <SkillLoader isSkillSearch={!isSkillSearch} />
              ) : (
                <React.Fragment>
                  {renderSkillSlideshow}
                  {routeType !== 'category' && isMobile && (
                    <Fragment>
                      <SideDrawer>
                        {renderTimeFilter}
                        <Divider
                          style={{ marginLeft: '16px', marginRight: '16px' }}
                        />
                        <ListSubheader>SUSI Skills</ListSubheader>
                        {renderMenu}
                        <Divider
                          style={{ marginLeft: '16px', marginRight: '16px' }}
                        />
                        {renderRatingsFilter}
                      </SideDrawer>
                    </Fragment>
                  )}
                  <ContentContainer>
                    {metricsHidden ? (
                      <div>
                        {noSkillFound}
                        <Grid
                          container
                          spacing={3}
                          direction={isMobile ? 'column-reverse' : 'row'}
                        >
                          <Grid
                            item
                            container
                            alignItems="center"
                            sm={6}
                            style={{
                              textAlign: 'center',
                              padding: isMobile ? '10px 30px' : '30px 25px 0',
                              fontSize: isMobile ? '14px' : '16px',
                            }}
                          >
                            {renderSkillCount}
                          </Grid>
                          <Grid item sm={6} container alignItems="center">
                            {skills.length > 0 && (
                              <FlexContainer>
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
                                    <MenuItem value={'lexicographical'}>
                                      Name (A-Z)
                                    </MenuItem>
                                    <MenuItem value={'top_rated'}>
                                      Top Rated
                                    </MenuItem>
                                    <MenuItem value={'rating'}>
                                      Most Rated
                                    </MenuItem>
                                    <MenuItem value={'creation_date'}>
                                      Newly Created
                                    </MenuItem>
                                    <MenuItem value={'modified_date'}>
                                      Recently updated
                                    </MenuItem>
                                    <MenuItem value={'feedback'}>
                                      Feedback Count
                                    </MenuItem>
                                    <MenuItem value={'usage&duration=7'}>
                                      This Week Usage
                                    </MenuItem>
                                    <MenuItem value={'usage&duration=30'}>
                                      This Month Usage
                                    </MenuItem>
                                  </Select>
                                </FilterFormControl>
                                {skills.length > 10 && (
                                  <SkillsFormControl>
                                    <InputLabel>Skills per page</InputLabel>
                                    <Select
                                      value={entriesPerPage}
                                      onChange={this.handleEntriesPerPageChange}
                                      style={{
                                        width: '5.1rem',
                                        marginTop: '1.5rem',
                                      }}
                                    >
                                      <MenuItem value={10}>10</MenuItem>
                                      <MenuItem value={20}>20</MenuItem>
                                      <MenuItem value={50}>50</MenuItem>
                                      <MenuItem value={100}>100</MenuItem>
                                    </Select>
                                  </SkillsFormControl>
                                )}
                                <RadioGroup
                                  defaultValue="list"
                                  value={viewType}
                                  onChange={this.handleViewChange}
                                  style={{ flexDirection: 'row' }}
                                >
                                  <Radio
                                    value="list"
                                    style={{
                                      width: 'fit-content',
                                      padding: '0px',
                                    }}
                                    checkedIcon={
                                      <ActionViewStream is-active={1} />
                                    }
                                    icon={<ActionViewStream />}
                                  />
                                  <Radio
                                    value="grid"
                                    style={{
                                      width: 'fit-content',
                                      padding: '0px',
                                    }}
                                    checkedIcon={
                                      <ActionViewModule is-active={1} />
                                    }
                                    icon={<ActionViewModule />}
                                  />
                                </RadioGroup>
                              </FlexContainer>
                            )}
                          </Grid>
                        </Grid>
                        <div>
                          {viewType === 'list' ? (
                            <SkillCardList />
                          ) : (
                            <SkillCardGrid history={history} />
                          )}
                        </div>
                        {skills.length > this.props.entriesPerPage && (
                          <PageNavigationContainer>
                            <div>
                              Page: {listPage} out of{' '}
                              {Math.ceil(skills.length / entriesPerPage)}
                            </div>
                            <br />
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
                                listPage ===
                                Math.ceil(skills.length / entriesPerPage)
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
                    {routeType === 'category'
                      ? backToHome
                      : isMobile && (
                          <Fragment>
                            <MobileMenuContainer>
                              {renderMobileMenu}
                            </MobileMenuContainer>
                          </Fragment>
                        )}
                  </ContentContainer>
                </React.Fragment>
              )}
            </RightContainer>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

function mapStateToProps(store) {
  return {
    ...store.router,
    ...store.skills,
    accessToken: store.app.accessToken,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skillActions, ...uiActions }, dispatch),
  };
}

BrowseSkill.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(BrowseSkill));

import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import styled, { css } from 'styled-components';
import Link from '../shared/Link';
import _ from 'lodash';
import PropTypes from 'prop-types';
import LINKS from './constants';
import { connect } from 'react-redux';
import { StyledIconButton } from '../shared/TopBarStyles';
import { withRouter } from 'react-router-dom';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import throttle from 'lodash.throttle';

const NavLinkContainer = styled.div`
  margin-left: 2rem;
  display: flex;
  align-items: center;
  @media (max-width: 800px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  :hover {
    color: white;
  }
`;

const NavButton = styled(StyledIconButton)`
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

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      activeTab: null,
    };
    this.throttledMenuClose = throttle(this.handleClose, 400);
  }

  handleClick = event => {
    if (this.state.anchorEl !== event.currentTarget) {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  onRouteChanged = () => {
    const { pathname } = this.props.location;
    const arr = pathname.split('/');
    const label = arr.length <= 1 ? arr.pop() : arr[1];
    if (label === '') {
      this.setState({ activeTab: 'About' });
      return;
    }
    this.setState({
      activeTab: label.charAt(0).toUpperCase() + label.slice(1),
    });
    return;
  };

  componentDidMount() {
    this.onRouteChanged();
    window.addEventListener('scroll', this.throttledMenuClose);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.throttledMenuClose);
  }

  render() {
    const { anchorEl, activeTab } = this.state;

    const open = Boolean(anchorEl);
    const { url, label, sublinks = [] } = this.props.link;

    const listItems = sublinks.map(({ label, url }) => (
      <Link key={label} to={url}>
        <MenuItem onClick={this.handleClose}>{label}</MenuItem>
      </Link>
    ));
    const renderIcon = open ? <ExpandLess /> : <ExpandMore />;
    return (
      <React.Fragment key={label}>
        {!_.isEmpty(sublinks) ? (
          <NavButton
            isActive={activeTab === label}
            key={label}
            onClick={this.handleClick}
          >
            {label}
            {renderIcon}
          </NavButton>
        ) : (
          <NavButton key={label}>
            <NavLink to={url}>{label}</NavLink>
          </NavButton>
        )}
        {!_.isEmpty(sublinks) && (
          <Popper open={open} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={this.handleClose}>
                <Fade {...TransitionProps}>
                  <Paper>{listItems}</Paper>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        )}
      </React.Fragment>
    );
  }
}

NavMenu.propTypes = {
  link: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

const WithRouterMenu = withRouter(NavMenu);

class TopMenu extends React.Component {
  static propTypes = {
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
  };
  render() {
    const { isAdmin, accessToken } = this.props;
    const navLinks = LINKS(accessToken, isAdmin).map(link => {
      return <WithRouterMenu key={link.label} link={link} />;
    });
    return <NavLinkContainer>{navLinks}</NavLinkContainer>;
  }
}

function mapStateToProps(store) {
  return {
    isAdmin: store.app.isAdmin,
    accessToken: store.app.accessToken,
  };
}

export default connect(
  mapStateToProps,
  null,
)(TopMenu);

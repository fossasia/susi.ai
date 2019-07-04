import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMore from '@material-ui/icons/ExpandMore';
import styled, { css } from 'styled-components';
import Link from '../shared/Link';
import _ from 'lodash';
import PropTypes from 'prop-types';
import LINKS from './constants';
import { connect } from 'react-redux';
import { StyledIconButton } from './Styles';
import { withRouter } from 'react-router-dom';
import Popper from './Popper';
import Paper from '@material-ui/core/Paper';

const NavLinkContainer = styled.div`
  margin-left: 2rem;
  display: flex;
  align-items: center;
  @media (max-width: 800px) {
    display: none;
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
      activeTab: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged = () => {
    const { pathname } = this.props.location;
    const arr = pathname.split('/');
    const label = arr[1];
    this.setState({
      activeTab: label.charAt(0).toUpperCase() + label.slice(1),
    });
    return;
  };

  componentDidMount() {
    this.onRouteChanged();
  }

  render() {
    const { activeTab } = this.state;
    const {
      link: { url, label, sublinks = [] },
      history,
    } = this.props;

    const listItems = sublinks.map(({ label, url }) => (
      <Link key={label} to={url}>
        <MenuItem>{label}</MenuItem>
      </Link>
    ));
    return (
      <div data-tip="custom" data-for={label}>
        <NavButton
          onClick={() => history.push(url)}
          isActive={activeTab === label}
          key={label}
        >
          {label}
          {!_.isEmpty(sublinks) && <ExpandMore />}
        </NavButton>
        {!_.isEmpty(sublinks) && (
          <Popper
            id={label}
            type={'light'}
            place="bottom"
            effect="solid"
            delayHide={200}
          >
            <Paper>{listItems}</Paper>
          </Popper>
        )}
      </div>
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

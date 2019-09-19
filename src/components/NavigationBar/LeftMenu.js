import React from 'react';
import { connect } from 'react-redux';
import LINKS from './constants';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Link from '../shared/Link';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import _ from 'lodash';
import PropTypes from 'prop-types';

class LeftMenu extends React.Component {
  static propTypes = {
    isAdmin: PropTypes.bool,
    accessToken: PropTypes.string,
    handleDrawerClose: PropTypes.func,
  };
  state = {};

  handleClick = label => {
    this.setState({ [label]: !this.state[label] });
  };

  render() {
    const { isAdmin, accessToken, handleDrawerClose } = this.props;
    const menuLinks = LINKS(accessToken, isAdmin).map(
      ({ label = '', Icon = null, url, sublinks = [] }) => {
        if (label === '') {
          return null;
        } else if (_.isEmpty(sublinks)) {
          return (
            <React.Fragment key={label}>
              <ListItem button key={label} component={Link} to={url}>
                {Icon && (
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                )}
                <ListItemText primary={label} />
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        }
        return (
          <React.Fragment key={label}>
            <ListItem
              button={true}
              key={label}
              component={Link}
              onClick={() => this.handleClick(label)}
            >
              {Icon && (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              )}
              <ListItemText primary={label} />
              {this.state[label] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={this.state[label]}
              timeout="auto"
              unmountOnExit={true}
            >
              {sublinks.map(({ label, url, Icon }) => {
                return (
                  <ListItem
                    button={true}
                    key={label}
                    component={Link}
                    to={url}
                    onClick={handleDrawerClose}
                  >
                    {Icon && (
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={label} />
                  </ListItem>
                );
              })}
            </Collapse>
            <Divider />
          </React.Fragment>
        );
      },
    );
    return <List>{menuLinks}</List>;
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
)(LeftMenu);

import React, { Component } from 'react';
import BrowseSkill from './BrowseSkill';
import PropTypes from 'prop-types';

export default class BrowseSkillByCategory extends Component {
  componentDidMount() {
    document.title = `SUSI.AI - ${
      this.props.location.pathname.split('/')[3]
    } Skills`;
  }
  render() {
    let category = '';
    if (this.props.location) {
      category = this.props.location.pathname.split('/')[3];
    }

    return <BrowseSkill routeType="category" routeValue={category} />;
  }
}

BrowseSkillByCategory.propTypes = {
  location: PropTypes.object,
  selector: PropTypes.string,
  text: PropTypes.string,
};

import React from 'react';
import BrowseSkill from './BrowseSkill';
import PropTypes from 'prop-types';
import ISO6391 from 'iso-639-1';

export default class BrowseSkillByCategory extends React.Component {
  componentDidMount() {
    document.title = `SUSI.AI - ${ISO6391.getNativeName(
      this.props.location.pathname.split('/')[2],
    )} Skills`;
  }
  render() {
    let language = '';
    if (this.props.location) {
      language = this.props.location.pathname.split('/')[2];
    }
    return <BrowseSkill routeType="language" routeValue={language} />;
  }
}

BrowseSkillByCategory.propTypes = {
  location: PropTypes.object,
  selector: PropTypes.string,
  text: PropTypes.string,
};

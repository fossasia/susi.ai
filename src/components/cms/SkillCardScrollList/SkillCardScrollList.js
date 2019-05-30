import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkillCard from './SkillCard';
import styles from '../BrowseSkill/SkillStyle';

class SkillCardScrollList extends Component {
  static propTypes = {
    metricSkills: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      innerWidth: window.innerWidth,
    };
  }

  render() {
    let metricsContainerStyle = {
      width: '100%',
      margin: this.state.innerWidth >= 430 ? '10px' : '10px 0px 10px 0px',
    };

    const skillCardListData = [
      {
        skills: 'staffPicksSkills',
        heading: 'Staff Picks',
      },
      {
        skills: 'topRatedSkills',
        heading: '"SUSI, what are your highest rated skills?"',
      },
      {
        skills: 'topUsedSkills',
        heading: '"SUSI, what are your most used skills?"',
      },
      {
        skills: 'newestSkills',
        heading: '"SUSI, what are the newest skills?"',
      },
      {
        skills: 'latestUpdatedSkills',
        heading: '"SUSI, what are the recently updated skills?"',
      },
      {
        skills: 'topFeedbackSkills',
        heading: '"SUSI, what are the skills with most feedback?"',
      },
      {
        skills: 'topGames',
        heading: '"SUSI, what are your top games?"',
      },
    ];

    let renderCardScrollList = '';

    renderCardScrollList = skillCardListData.map((data, index) => {
      return this.props.metricSkills[data.skills].length ? (
        <div key={index} style={metricsContainerStyle}>
          <div style={styles.metricsHeader} className="metrics-header">
            <h4>{data.heading}</h4>
          </div>
          <SkillCard scrollSkills={data.skills} />
        </div>
      ) : null;
    });
    return <div>{renderCardScrollList}</div>;
  }
}

function mapStateToProps(store) {
  return {
    ...store.skills,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SkillCardScrollList);

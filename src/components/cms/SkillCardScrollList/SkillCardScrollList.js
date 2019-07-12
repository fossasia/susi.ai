import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SkillCard from './SkillCard';
import styled from 'styled-components';

const HeaderText = styled.h4`
  padding-left: 1rem;
  font-size: 1.25rem;
  @media (max-width: 418px) {
        font-size: 1rem;
`;

const Container = styled.div`
  width: 100%;
  margin: 0.625rem 0px;
  @media (max-width: 430px) {
    margin: 0.625rem;
  }
`;

const skillCardListData = [
  {
    skills: 'systemSkills',
    heading: 'System Skills',
  },
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

const SkillCardScrollList = ({ metricSkills }) => {
  let renderCardScrollList = '';

  renderCardScrollList = skillCardListData.map((data, index) => {
    return metricSkills[data.skills].length ? (
      <Container key={index}>
        <HeaderText>{data.heading}</HeaderText>
        <SkillCard scrollSkills={data.skills} />
      </Container>
    ) : null;
  });
  return <div>{renderCardScrollList}</div>;
};

SkillCardScrollList.propTypes = {
  metricSkills: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    metricSkills: store.skills.metricSkills,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SkillCardScrollList);

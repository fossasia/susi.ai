import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _Paper from '@material-ui/core/Paper';
import MySkills from './MySkills';
import MyRatings from './MyRatings';
import MyAnalytics from './MyAnalytics';
import StaticAppBar from '../../StaticAppBar/StaticAppBar.react';
import styled from 'styled-components';
import './Dashboard.css';

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  min-width: 40rem;
`;

const Heading = styled.h1`
  color: black;
  margin-top: 1.25rem;
  width: 100%;
  min-width: 40rem;
`;

const SubHeading = styled.h1`
  color: rgba(0, 0, 0, 0.65);
  padding-left: 1.25rem;
`;

const StyledErrorParagraph = styled.p`
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 6.25rem;
  font-size: 3.125rem;
  margin-top: 18.75rem;
`;

const Dashboard = props => {
  const { accessToken } = props;
  document.title = 'SUSI.AI - Dashboard';
  if (!accessToken) {
    return (
      <div>
        <StaticAppBar {...props} />
        <div>
          <StyledErrorParagraph>
            Please login to view dashboard.
          </StyledErrorParagraph>
        </div>
      </div>
    );
  }
  return (
    <div>
      <StaticAppBar {...props} />
      <div className="botbuilder-page-wrapper">
        <br />
        <br />
        <Heading className="center">My Dashboard</Heading>
        <br />
        <Paper className="botBuilder-page-card">
          <SubHeading>My Skills</SubHeading>
          <MySkills />
        </Paper>
        <Paper className="botBuilder-page-card">
          <SubHeading>My Ratings</SubHeading>
          <MyRatings />
        </Paper>
        <Paper className="botBuilder-page-card">
          <SubHeading>My Analytics</SubHeading>
          <MyAnalytics />
        </Paper>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
  };
}

export default connect(
  mapStateToProps,
  null,
)(Dashboard);

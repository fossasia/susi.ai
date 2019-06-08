import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _Paper from '@material-ui/core/Paper';
import MySkills from './MySkills';
import MyRatings from './MyRatings';
import MyAnalytics from './MyAnalytics';
import styled from 'styled-components';

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  min-width: 40rem;
  padding: 1rem 1rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
`;

const Heading = styled.h1`
  color: black;
  width: 100%;
  min-width: 40rem;
  padding: 1rem 0;
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
  margin: 18.6rem 0;
  @media (max-width: 886px) {
    margin: 15rem 0;
  }
  @media (max-width: 745px) {
    margin: 13.5rem 0;
  }
  @media (max-width: 520px) {
    margin: 11.5rem 0;
  }
  @media (max-width: 456px) {
    font-size: 2.1rem;
    margin: 13rem 0;
  }
`;

const Container = styled.div`
  padding: 4rem 4rem 2rem;
  @media (max-width: 855px) {
    padding: 4rem 0 2rem;
  }
`;

const Dashboard = props => {
  const { accessToken } = props;
  document.title = 'SUSI.AI - Dashboard';
  if (!accessToken) {
    return (
      <div>
        <StyledErrorParagraph>
          Please login to view dashboard.
        </StyledErrorParagraph>
      </div>
    );
  }
  return (
    <Container>
      <Heading>My Dashboard</Heading>
      <Paper>
        <SubHeading>My Skills</SubHeading>
        <MySkills />
      </Paper>
      <Paper>
        <SubHeading>My Ratings</SubHeading>
        <MyRatings />
      </Paper>
      <Paper>
        <SubHeading>My Analytics</SubHeading>
        <MyAnalytics />
      </Paper>
    </Container>
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

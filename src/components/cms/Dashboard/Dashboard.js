import React from 'react';
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

const Container = styled.div`
  padding: 4rem 4rem 2rem;
  @media (max-width: 855px) {
    padding: 4rem 0 2rem;
  }
`;

const Dashboard = props => {
  document.title = 'SUSI.AI - Dashboard';
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

export default Dashboard;

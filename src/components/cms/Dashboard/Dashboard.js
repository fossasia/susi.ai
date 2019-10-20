import React from 'react';
import PropTypes from 'prop-types';
import _Paper from '@material-ui/core/Paper';
import MySkills from './MySkills';
import MyRatings from './MyRatings';
import MyAnalytics from './MyAnalytics';
import styled, { ThemeProvider } from 'styled-components';
import { connect } from 'react-redux';
import theme from 'styled-theming';

const headerColor = theme('mode', {
  dark: '#70869c',
  light: 'black',
});

const paperColor = theme('mode', {
  dark: '#204061',
  light: '#f2f2f2',
});

const Paper = styled(_Paper)`
  width: 100%;
  margin-top: 1.25rem;
  padding: 1rem 1rem 3rem;
  @media (max-width: 740) {
    padding: 0 0 3rem;
  }
  background-color: ${paperColor};
`;

const Heading = styled.h1`
  color: black;
  width: 100%;
  min-width: 40rem;
  padding: 1rem 0;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SubHeading = styled.h1`
  color: ${headerColor};
  padding-left: 1.25rem;
`;

const Container = styled.div`
  margin: 0rem 0.625rem;
  padding: 1.25rem 1.875rem 1.875rem;

  @media (max-width: 480px) {
    padding: 1.25rem 1rem 1.875rem;
  }
`;

const Dashboard = props => {
  document.title = 'SUSI.AI - Dashboard';
  const { showTitle = true, theme } = props;
  return (
    <Container>
      {showTitle && <Heading>My Dashboard</Heading>}
      <ThemeProvider
        theme={theme === 'dark' ? { mode: 'dark' } : { mode: 'light' }}
      >
        <div>
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
        </div>
      </ThemeProvider>
    </Container>
  );
};

Dashboard.propTypes = {
  showTitle: PropTypes.bool,
  theme: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    theme: store.settings.theme,
  };
}
export default connect(
  mapStateToProps,
  null,
)(Dashboard);

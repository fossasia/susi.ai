import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import dashboardActions from '../../../redux/actions/dashboard';
import CircularLoader from '../../shared/CircularLoader';
import { fetchSkillsByAuthor } from '../../../apis';
import { Cell } from 'recharts';
import PieChartContainer from '../../shared/PieChartContainer';
import { SubTitle } from '../../shared/Typography';
import styled from 'styled-components';

const Container = styled.div`
  @media (max-width: 720px) {
    overflow-x: scroll;
  }
`;

class MyAnalytics extends Component {
  componentDidMount() {
    this.loadSkillsUsage();
  }

  loadSkillsUsage = async () => {
    const { email, uiActions } = this.props;
    // eslint-disable-next-line
    try {
      // eslint-disable-next-line camelcase
      let payload = await fetchSkillsByAuthor({ author_email: email });
      this.saveUsageData(payload.authorSkills || []);
    } catch (error) {
      uiActions.openSnackBar({
        snackBarMessage: "Error. Couldn't fetch skill usage.",
        snackBarDuration: 2000,
      });
      dashboardActions.setUserAnalytics({
        loading: false,
      });
    }
  };

  saveUsageData = data => {
    const { dashboardActions } = this.props;

    let skillUsageCount = 0;
    let skillUsage = null;
    if (data && Array.isArray(data) && data.length > 0) {
      skillUsage = data.map(skill => {
        let dataObject = {};
        dataObject.skillName = skill.skillName;
        dataObject.usageCount = skill.usageCount || 0;
        skillUsageCount += dataObject.usageCount;
        return dataObject;
      });
    }
    dashboardActions.setUserAnalytics({
      skillUsage,
      loading: false,
      userSkills: data.length,
      skillUsageCount,
    });
  };

  render() {
    let {
      skillUsage,
      skillUsageCount,
      userSkills,
      loading,
    } = this.props.analytics;
    let noskillCreatedMessage =
      userSkills && Array.isArray(userSkills) && userSkills.length > 0
        ? ''
        : 'Your skill has not been used, make sure to improve your skill to attract more users.';
    return (
      <div>
        {loading ? (
          <CircularLoader height={5} />
        ) : (
          <Container>
            {skillUsage &&
              Array.isArray(skillUsage) &&
              skillUsage.length > 0 &&
              skillUsageCount !== 0 && (
                <React.Fragment>
                  <SubTitle marginLeft={1.4}>Skill Usage Distribution</SubTitle>
                  <PieChartContainer
                    cellData={
                      skillUsage &&
                      Array.isArray(skillUsage) &&
                      skillUsage.length > 0 &&
                      skillUsage.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            [
                              '#0088FE',
                              '#00C49F',
                              '#FFBB28',
                              '#FF8042',
                              '#EA4335',
                            ][index % 5]
                          }
                        />
                      ))
                    }
                    data={skillUsage}
                    nameKey="skillName"
                    dataKey="usageCount"
                  />
                </React.Fragment>
              )}
          </Container>
        )}
        {skillUsageCount === 0 && noskillCreatedMessage !== '' && !loading && (
          <Container>
            <div className="center">
              <br />
              <h2 style={{ textAlign: 'center', padding: '5px' }}>
                {noskillCreatedMessage}
              </h2>
              <br />
            </div>
          </Container>
        )}
      </div>
    );
  }
}

MyAnalytics.propTypes = {
  email: PropTypes.string,
  analytics: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  uiActions: PropTypes.object,
  dashboardActions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    email: store.app.email,
    analytics: store.dashboard.analytics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActions, dispatch),
    dashboardActions: bindActionCreators(dashboardActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAnalytics);

import React from 'react';
import _Card from '@material-ui/core/Card';
import styled, { css } from 'styled-components';
import _Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Lozenge from '../../shared/Lozenge';
import { fetchAdminUserStats, fetchAdminUserSkill } from '../../../apis/index';
import CircularLoader from '../../shared/CircularLoader';
import LineChart from '../../shared/charts/LineChart';
import moment from 'moment';
import sortByDate from '../../../utils/sortByDate';
import findUnixEpochDateIndex from '../../../utils/findUnixEpochDateIndex';

const CardHeading = styled.h3`
  padding-left: 1rem;
`;

const CardContentContainer = styled.div`
  padding: 1rem;
`;

const CardContainer = styled.span`
  font-size: 18px;
  float: left;
  margin: 0 10px;
  @media (max-width: 894px) {
    margin: 0px;
  }
  @media (max-width: 514px) {
    width: 100%;
  }
`;

const Typography = styled(_Typography)`
  @media (max-width: 441px) {
    font-size: 1rem;
  }
`;

const Container = styled.div`
  width: 840px;
  margin: auto;
  @media (min-width: 1319px) {
    ${CardContainer}:last-child {
      display: table;
      float: none;
      margin: auto;
    }
    width: 1260px;
  }
  @media (max-width: 894px) {
    width: 400px;
  }
  @media (max-width: 514px) {
    width: 80%;
  }
`;

const Card = styled(_Card)`
  width: ${props => (props.width ? props.width : '400px')};
  height: ${props => (props.height ? props.height + 'px' : '310px')};
  font-size: 18px;
  line-height: 2;
  ${props =>
    props.margin &&
    css`
      margin: ${props => props.margin};
      padding-right: 1rem;
    `}
  & {
    margin-bottom: 20px;
  }
  @media (max-width: 514px) {
    width: 100%;
  }
`;

const SkillCard = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
`;

class AdminTab extends React.Component {
  state = {
    userStats: {},
    skillStats: {},
    deviceStats: {},
    loading: false,
    creationOverTime: [],
    lastAccessOverTime: [],
    lastModifiedOverTime: [],
    lastLoginOverTime: [],
    signupOverTime: [],
    deviceAddedOverTime: [],
  };

  async componentDidMount() {
    try {
      try {
        let payload = await fetchAdminUserStats({ getUserStats: true });
        const {
          userStats,
          lastLoginOverTime = [],
          signupOverTime = [],
        } = payload;
        this.setState({
          userStats,
          lastLoginOverTime,
          signupOverTime,
        });
      } catch (error) {
        console.log(error);
      }

      try {
        let payload = await fetchAdminUserStats({ getDeviceStats: true });
        const { deviceStats } = payload;
        const { deviceAddedOverTime } = deviceStats;
        this.setState({ deviceStats, deviceAddedOverTime });
      } catch (error) {
        console.log(error);
      }

      try {
        let payload = await fetchAdminUserSkill();
        const {
          skillStats,
          creationOverTime,
          lastAccessOverTime,
          lastModifiedOverTime,
        } = payload;
        this.setState({
          skillStats,
          creationOverTime,
          lastAccessOverTime,
          lastModifiedOverTime,
        });
      } catch (error) {
        console.log(error);
      }

      try {
        let payload = await fetchAdminUserSkill();
        const {
          skillStats,
          creationOverTime,
          lastAccessOverTime,
          lastModifiedOverTime,
        } = payload;
        this.setState({
          skillStats,
          creationOverTime,
          lastAccessOverTime,
          lastModifiedOverTime,
        });
      } catch (error) {
        console.log(error);
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
    }
  }

  renderCharts = () => {
    const {
      creationOverTime,
      lastAccessOverTime,
      lastModifiedOverTime,
      lastLoginOverTime,
      signupOverTime,
      deviceAddedOverTime,
    } = this.state;

    const CONFIG = [
      {
        data: lastModifiedOverTime,
        heading: 'Skill Edits over Time',
        legend: 'Skill edits',
      },
      {
        data: lastAccessOverTime,
        heading: 'Skill Usage over Time',
        legend: 'Skill usage',
      },
      {
        data: creationOverTime,
        heading: 'Skill Creations over Time',
        legend: 'Skill creations',
      },
      {
        data: signupOverTime,
        heading: 'User Registrations over Time',
        legend: 'User registrations',
      },
      {
        data: lastLoginOverTime,
        heading: 'User Logins over Time',
        legend: 'User logins',
      },
      {
        data: deviceAddedOverTime,
        heading: 'Devices Added over Time',
        legend: 'Devices Added',
        sort: false,
      },
    ];

    return CONFIG.map(chart => {
      if (chart.data.length > 0) {
        return this.renderChart(chart);
      }
      return null;
    });
  };

  renderChart = ({ data, heading, legend, sort = true }) => {
    let dataOverTime = data;
    if (sort) {
      dataOverTime = sortByDate(data);
    }
    let chartData = dataOverTime.map(data => {
      const chatObj = {};
      chatObj.timestamp = moment(data.timeStamp).format('MM/YY');
      chatObj.count = data.count;
      return chatObj;
    });
    let idx = findUnixEpochDateIndex(chartData);
    if (idx >= 0) {
      while (idx >= 0) {
        chartData.shift();
        idx--;
      }
    }

    return (
      data.length > 0 && (
        <Card height={'400'} width={'1240px'} margin={'0 10px'}>
          <CardHeading>{heading}</CardHeading>
          <LineChart data={chartData} legend={legend} customTooltip={true} />
        </Card>
      )
    );
  };

  render() {
    const {
      loading,
      userStats: {
        anonymous = 0,
        users = 0,
        reviewers = 0,
        operators = 0,
        admins = 0,
        superAdmins = 0,
        totalUsers = 0,
        activeUsers = 0,
        inactiveUsers = 0,
      },
      skillStats: {
        totalSkills = 0,
        reviewedSkills = 0,
        nonReviewedSkills = 0,
        systemSkills = 0,
        staffPicks = 0,
        editableSkills = 0,
        nonEditableSkills = 0,
      },
      deviceStats: { connectedDevices = 0, deviceUsers = 0 },
    } = this.state;

    return (
      <React.Fragment>
        {loading ? (
          <CircularLoader />
        ) : (
          <div style={{ margin: '2rem 0' }}>
            <Container>
              <CardContainer>
                <Card>
                  <CardHeading>User Roles</CardHeading>
                  <Divider />
                  <CardContentContainer>
                    <Typography variant="body1" gutterBottom>
                      Anonymous: {anonymous}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Users: {users}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Reviewers: {reviewers}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Operators: {operators}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Admins: {admins}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Super Admins: {superAdmins}
                    </Typography>
                  </CardContentContainer>
                </Card>
              </CardContainer>
              <CardContainer>
                <Card width={'400px'}>
                  <CardHeading>Users</CardHeading>
                  <Divider />
                  <SkillCard>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Total
                      </Typography>
                      <Lozenge color="orange" text={totalUsers} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Active
                      </Typography>
                      <Lozenge color="green" text={activeUsers} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Inactive
                      </Typography>
                      <Lozenge color="red" text={inactiveUsers} />
                    </div>
                  </SkillCard>
                </Card>
              </CardContainer>

              <CardContainer>
                <Card width={'400px'}>
                  <CardHeading>Skills</CardHeading>
                  <Divider />
                  <SkillCard>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Total
                      </Typography>
                      <Lozenge color="orange" text={totalSkills} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Reviewed
                      </Typography>
                      <Lozenge color="green" text={reviewedSkills} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Not Reviewed
                      </Typography>
                      <Lozenge color="red" text={nonReviewedSkills} />
                    </div>
                  </SkillCard>
                </Card>
              </CardContainer>
              <CardContainer>
                <Card>
                  <CardHeading>Skill Types</CardHeading>
                  <Divider />
                  <CardContentContainer>
                    <Typography variant="body1" gutterBottom>
                      System Skills: {systemSkills}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Staff Picks: {staffPicks}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Editable: {editableSkills}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Non Editable: {nonEditableSkills}
                    </Typography>
                  </CardContentContainer>
                </Card>
              </CardContainer>
              <CardContainer>
                <Card>
                  <CardHeading>Devices</CardHeading>
                  <Divider />
                  <CardContentContainer>
                    <Typography variant="body1" gutterBottom>
                      Connected devices: {connectedDevices}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      User with devices: {deviceUsers}
                    </Typography>
                  </CardContentContainer>
                </Card>
              </CardContainer>
              {this.renderCharts()}
            </Container>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AdminTab;

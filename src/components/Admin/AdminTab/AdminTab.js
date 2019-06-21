import React from 'react';
import _Card from '@material-ui/core/Card';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Lozenge from '../../shared/Lozenge';
import { fetchAdminUserStats, fetchAdminUserSkill } from '../../../apis/index';
import { CircularProgress } from '@material-ui/core';

const CardHeading = styled.h3`
  padding-left: 1rem;
`;

const CardContentContainer = styled.div`
  padding: 1rem;
`;

const Center = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CardContainer = styled.span`
  font-size: 18px;
  float: left;
  margin-right: 20px;
`;

const Card = styled(_Card)`
  width: ${props => (props.width ? props.width + 'px' : '300px')};
  height: 310px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  line-height: 2;
`;

class AdminTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userStats: {},
      skillStats: {},
      loading: false,
    };
  }

  componentDidMount() {
    Promise.all([
      fetchAdminUserStats({ getUserStats: 'true' })
        .then(payload => {
          const { userStats } = payload;
          this.setState({
            userStats,
          });
        })
        .catch(error => {
          console.log(error);
        }),
      fetchAdminUserSkill()
        .then(payload => {
          const { skillStats } = payload;
          this.setState({
            skillStats,
          });
        })
        .catch(error => {
          console.log(error);
        }),
    ])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
      });
  }

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
    } = this.state;
    return (
      <React.Fragment>
        {loading ? (
          <Center>
            <CircularProgress size={62} />
          </Center>
        ) : (
          <div style={{ margin: '1rem' }}>
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
              <Card width={400}>
                <CardHeading>Users</CardHeading>
                <Divider />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '50px',
                  }}
                >
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
                </div>
              </Card>
            </CardContainer>

            <CardContainer>
              <Card width={400}>
                <CardHeading>Skills</CardHeading>
                <Divider />
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '50px',
                  }}
                >
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
                </span>
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
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AdminTab;

import React from 'react';
import Card from '@material-ui/core/Card';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Lozenge from '../../shared/Lozenge';
import { fetchAdminUserStats, fetchAdminUserSkill } from '../../../apis/index';

const CardHeading = styled.h3`
  padding-left: 1rem;
`;

const CardContentContainer = styled.div`
  padding: 1rem;
`;

class AdminTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userStats: {},
      skillStats: {},
      loadingUsers: true,
      loadingSkills: true,
    };
  }

  componentDidMount() {
    fetchAdminUserStats({ getUserStats: 'true' })
      .then(payload => {
        const { userStats } = payload;
        this.setState({
          userStats,
          loadingUsers: false,
        });
      })
      .catch(error => {
        console.log(error);
      });

    fetchAdminUserSkill()
      .then(payload => {
        const { skillStats } = payload;
        this.setState({
          skillStats,
          loadingSkills: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div style={{ margin: '1rem' }}>
        <span
          style={{
            fontSize: '18px',
            fontWeight: '5000',
            float: 'left',
            marginRight: '20px',
          }}
        >
          <Card
            loading={this.state.loadingUsers}
            style={{
              width: '300px',
              height: '310px',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '2',
            }}
          >
            <CardHeading>User Roles</CardHeading>
            <Divider />
            <CardContentContainer>
              <Typography variant="body1" gutterBottom>
                Anonymous:{' '}
                {this.state.userStats.anonymous
                  ? this.state.userStats.anonymous
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Users:{' '}
                {this.state.userStats.users ? this.state.userStats.users : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Reviewers:{' '}
                {this.state.userStats.reviewers
                  ? this.state.userStats.reviewers
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Operators:{' '}
                {this.state.userStats.operators
                  ? this.state.userStats.operators
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Admins:{' '}
                {this.state.userStats.admins ? this.state.userStats.admins : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Super Admins:{' '}
                {this.state.userStats.superAdmins
                  ? this.state.userStats.superAdmins
                  : 0}
              </Typography>
            </CardContentContainer>
          </Card>
        </span>

        <span
          style={{
            fontSize: '18px',
            fontWeight: '5000',
            float: 'left',
            marginRight: '20px',
          }}
        >
          <Card loading={this.state.loadingUsers} className="flexCard">
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
                <Lozenge
                  color="orange"
                  text={
                    this.state.userStats.totalUsers
                      ? this.state.userStats.totalUsers
                      : 0
                  }
                />
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Active
                </Typography>
                <Lozenge
                  color="green"
                  text={
                    this.state.userStats.activeUsers
                      ? this.state.userStats.activeUsers
                      : 0
                  }
                />
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Inactive
                </Typography>
                <Lozenge
                  color="red"
                  text={
                    this.state.userStats.inactiveUsers
                      ? this.state.userStats.inactiveUsers
                      : 0
                  }
                />
              </div>
            </div>
          </Card>
        </span>

        <span
          style={{
            fontSize: '18px',
            fontWeight: '5000',
            float: 'left',
            marginRight: '20px',
          }}
        >
          <Card className="flexCard" loading={this.state.loadingSkills}>
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
                <Lozenge
                  color="orange"
                  text={
                    this.state.skillStats.totalSkills
                      ? this.state.skillStats.totalSkills
                      : 0
                  }
                />
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Reviewed
                </Typography>
                <Lozenge
                  color="green"
                  text={
                    this.state.skillStats.reviewedSkills
                      ? this.state.skillStats.reviewedSkills
                      : 0
                  }
                />
              </div>
              <div>
                <Typography variant="h6" gutterBottom>
                  Not Reviewed
                </Typography>
                <Lozenge
                  color="red"
                  text={
                    this.state.skillStats.nonReviewedSkills
                      ? this.state.skillStats.nonReviewedSkills
                      : 0
                  }
                />
              </div>
            </span>
          </Card>
        </span>

        <span
          style={{
            fontSize: '18px',
            fontWeight: '5000',
            float: 'left',
            marginRight: '20px',
          }}
        >
          <Card
            loading={this.state.loadingSkills}
            style={{
              width: '300px',
              height: '310px',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              lineHeight: '2',
            }}
          >
            <CardHeading>Skill Types</CardHeading>
            <Divider />
            <CardContentContainer>
              <Typography variant="body1" gutterBottom>
                System Skills:{' '}
                {this.state.skillStats.systemSkills
                  ? this.state.skillStats.systemSkills
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Staff Picks:{' '}
                {this.state.skillStats.staffPicks
                  ? this.state.skillStats.staffPicks
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Editable:{' '}
                {this.state.skillStats.editableSkills
                  ? this.state.skillStats.editableSkills
                  : 0}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Non Editable:{' '}
                {this.state.skillStats.nonEditableSkills
                  ? this.state.skillStats.nonEditableSkills
                  : 0}
              </Typography>
            </CardContentContainer>
          </Card>
        </span>
      </div>
    );
  }
}

export default AdminTab;

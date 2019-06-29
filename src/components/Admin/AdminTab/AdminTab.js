import React from 'react';
import _Card from '@material-ui/core/Card';
import styled from 'styled-components';
import _Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Lozenge from '../../shared/Lozenge';
import { fetchAdminUserStats, fetchAdminUserSkill } from '../../../apis/index';
import CircularLoader from '../../shared/CircularLoader';

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
  width: ${props => (props.width ? props.width + 'px' : '400px')};
  height: 310px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  line-height: 2;
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
          <CircularLoader />
        ) : (
          <div style={{ margin: '1rem 0' }}>
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
                <Card width={400}>
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
                <Card width={400}>
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
            </Container>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AdminTab;

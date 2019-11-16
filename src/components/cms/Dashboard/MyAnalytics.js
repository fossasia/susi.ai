import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import _Link from '../../shared/Link';
import Add from '@material-ui/icons/Add';
import Button from '../../shared/Button';
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

const Link = styled(_Link)`
  float: right;
  margin-right: 1.25rem;
  display: block;
  @media (max-width: 600px) {
    float: left;
    margin-left: 1.25rem;
  }
`;

class MyAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillUsage: [],
      loading: true,
      skillUsageCount: 0,
    };
  }
  componentDidMount() {
    this.loadSkillsUsage();
  }

  loadSkillsUsage = async () => {
    const { email, actions } = this.props;
    // eslint-disable-next-line
    try {
      // eslint-disable-next-line camelcase
      let payload = await fetchSkillsByAuthor({ author_email: email });
      this.saveUsageData(payload.authorSkills || []);
      this.setState({
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      actions.openSnackBar({
        snackBarMessage: "Error. Couldn't fetch skill usage.",
        snackBarDuration: 2000,
      });
    }
  };

  saveUsageData = data => {
    let skillUsageCount = 0;
    const skillUsage = data.map(skill => {
      let dataObject = {};
      dataObject.skillName = skill.skillName;
      dataObject.usageCount = skill.usageCount || 0;
      skillUsageCount += dataObject.usageCount;
      return dataObject;
    });
    this.setState({
      skillUsage,
      skillUsageCount,
    });
  };

  render() {
    let { skillUsage, loading, skillUsageCount } = this.state;
    return (
      <div>
        {loading ? (
          <CircularLoader height={5} />
        ) : (
          <Container>
            {skillUsageCount !== 0 && (
              <React.Fragment>
                <SubTitle marginLeft={1.4}>Skill Usage Distribution</SubTitle>
                <PieChartContainer
                  cellData={skillUsage.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EA4335'][
                          index % 5
                        ]
                      }
                    />
                  ))}
                  data={skillUsage}
                  nameKey="skillName"
                  dataKey="usageCount"
                />
              </React.Fragment>
            )}
          </Container>
        )}
        {skillUsageCount === 0 && !loading && (
          <Container>
            <Link to="/skillWizard">
              <Button variant="contained" color="primary">
                <Add /> Create Skill
              </Button>
            </Link>
            <div className="center">
              <br />
              <h2 style={{ textAlign: 'center' }}>
                You have not created any skill yet
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
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    email: store.app.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAnalytics);

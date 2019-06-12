import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchSkillsByAuthor } from '../../../apis';
import { Cell } from 'recharts';
import PieChartContainer from '../../shared/PieChartContainer';

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

  loadSkillsUsage = () => {
    const { email, actions } = this.props;
    // eslint-disable-next-line
    fetchSkillsByAuthor({ author_email: email })
      .then(payload => {
        this.saveUsageData(payload.authorSkills || []);
        this.setState({
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error. Couldn't fetch skill usage.",
          snackBarDuration: 2000,
        });
      });
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
          <div className="center">
            <CircularProgress size={62} color="primary" />
            <h4>Loading</h4>
          </div>
        ) : (
          <div>
            {skillUsageCount !== 0 && (
              <div className="device-usage">
                <div className="sub-title">Skill Usage Distribution</div>
                <div className="pie-chart">
                  <PieChartContainer
                    cellData={skillUsage.map((entry, index) => (
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
                    ))}
                    data={skillUsage}
                    nameKey="skillName"
                    dataKey="usageCount"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        {skillUsageCount === 0 &&
          !loading && (
            <div>
              <div className="center">
                <br />
                <h2>
                  Your skill has not been used, make sure to improve your skill
                  to attract more users.
                </h2>
                <br />
              </div>
            </div>
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

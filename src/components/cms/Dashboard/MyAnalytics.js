import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchSkillsByAuthor } from '../../../apis';
import {
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${name}: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

renderActiveShape.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  fill: PropTypes.string,
  percent: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
};

class MyAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillUsage: [],
      loading: true,
      activePieIndex: 0,
      skillUsageCount: 0,
    };
  }
  componentDidMount() {
    this.loadSkillsUsage();
  }

  loadSkillsUsage = () => {
    const { email, actions } = this.props;
    fetchSkillsByAuthor({ authorEmail: email })
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

  onPieEnter = (data, index) => {
    this.setState({
      activePieIndex: index,
    });
  };

  render() {
    let { skillUsage, activePieIndex, loading, skillUsageCount } = this.state;
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
                  <ResponsiveContainer width={600} height={350}>
                    <PieChart>
                      <Pie
                        activeIndex={activePieIndex}
                        activeShape={renderActiveShape}
                        data={skillUsage}
                        cx={300}
                        cy={175}
                        innerRadius={80}
                        nameKey="skill_name"
                        dataKey="usage_count"
                        outerRadius={120}
                        fill="#8884d8"
                        onMouseEnter={this.onPieEnter}
                      >
                        {skillUsage.map((entry, index) => (
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
                      </Pie>
                      <Legend wrapperStyle={{ position: 'relative' }} />
                    </PieChart>
                  </ResponsiveContainer>
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

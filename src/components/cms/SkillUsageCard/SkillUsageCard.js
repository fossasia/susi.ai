// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import isMobileView from '../../../utils/isMobileView';

// Components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import CountryWiseSkillUsageCard from '../CountryWiseSkillUsageCard/CountryWiseSkillUsageCard';

// Material UI
import _Paper from '@material-ui/core/Paper';

// Static assets
import './SkillUsageCard.css';
import PieChartContainer from '../../shared/PieChartContainer';

const Paper = styled(_Paper)`
  @media (max-width: 500px) {
    width: 60%;
  }
  @media (max-width: 370px) {
    width: 55%;
  }
`;

const Container = styled.div`
  @media (max-width: 500px) {
    width: 100%;
    overflow-x: scroll;
  }
`;

class SkillUsageCard extends Component {
  static propTypes = {
    dateWiseSkillUsage: PropTypes.array,
    deviceWiseSkillUsage: PropTypes.array,
    countryWiseSkillUsage: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  componentDidMount = () => {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth * 0.8 > 800 ? 800 : window.innerWidth * 0.8,
    });
  };

  totalUsage = (dateWiseSkillUsage = []) => {
    let totalSkillUsage = 0;
    if (dateWiseSkillUsage) {
      totalSkillUsage = dateWiseSkillUsage.reduce((totalCount, day) => {
        if (day) {
          return totalCount + day.count;
        }
        return totalCount;
      }, 0);
    }
    return totalSkillUsage;
  };

  render() {
    const {
      dateWiseSkillUsage,
      deviceWiseSkillUsage,
      countryWiseSkillUsage,
    } = this.props;
    const { width } = this.state;
    const mobileView = isMobileView();

    let totalSkillUsage = this.totalUsage(dateWiseSkillUsage);
    return (
      <div>
        <Paper className="margin-b-md margin-t-md">
          <h1 className="title">Skill Usage</h1>
          <div>
            <div className="sub-title" style={{ paddingLeft: '20px' }}>
              Time wise Usage
            </div>
            {totalSkillUsage > 0 ? (
              <div>
                <div className="time-chart">
                  <Container>
                    <ResponsiveContainer
                      width={mobileView ? 600 : width}
                      height={300}
                    >
                      <LineChart
                        data={dateWiseSkillUsage}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="date" padding={{ right: 20 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip wrapperStyle={{ height: '60px' }} />
                        <Legend />
                        <Line
                          name="Skill usage count"
                          type="monotone"
                          dataKey="count"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Container>
                </div>
                <div className="total-hits">
                  <div className="large-text">{totalSkillUsage}</div>
                  Hits this week
                </div>
              </div>
            ) : (
              <div className="default-message">
                No time wise skill usage data available.
              </div>
            )}
            <div className="device-usage">
              <div className="sub-title">Device wise Usage</div>
              {deviceWiseSkillUsage && deviceWiseSkillUsage.length ? (
                <Container className="pie-chart">
                  <PieChartContainer
                    cellData={deviceWiseSkillUsage.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                    data={deviceWiseSkillUsage}
                    nameKey="deviceType"
                    dataKey="count"
                  />
                </Container>
              ) : (
                <div className="default-message">
                  No device wise usage data available.
                </div>
              )}
            </div>
          </div>
          <div className="country-usage">
            <div className="sub-title">Country wise Usage</div>
            <CountryWiseSkillUsageCard
              countryWiseSkillUsage={countryWiseSkillUsage}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    dateWiseSkillUsage: store.skill.dateWiseSkillUsage,
    countryWiseSkillUsage: store.skill.countryWiseSkillUsage,
    deviceWiseSkillUsage: store.skill.deviceWiseSkillUsage,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SkillUsageCard);

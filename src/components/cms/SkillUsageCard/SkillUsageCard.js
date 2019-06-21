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
import PieChartContainer from '../../shared/PieChartContainer';
import { Paper as _Paper } from '../../shared/Container';
import { Title, SubTitle, LargeText } from '../../shared/Typography';

const Paper = styled(_Paper)`
  width: 100%;
`;

const Container = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  @media (max-width: 500px) {
    width: 100%;
    overflow-x: scroll;
  }
`;

const DefaultMessage = styled.div`
  margin: 0.625rem;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
`;

const UsageContainer = styled.div`
  margin: 1rem;
  padding: 0.5rem;
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
      <Paper>
        <Title>Skill Usage</Title>
        <UsageContainer>
          <SubTitle>Time wise Usage</SubTitle>
          {totalSkillUsage > 0 ? (
            <React.Fragment>
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
              <div style={{ textAlign: 'center', padding: '1.5rem 3rem' }}>
                <LargeText>{totalSkillUsage}</LargeText>
                Hits this week
              </div>
            </React.Fragment>
          ) : (
            <DefaultMessage>
              No time wise skill usage data available.
            </DefaultMessage>
          )}
        </UsageContainer>
        <UsageContainer>
          <SubTitle>Device wise Usage</SubTitle>
          {deviceWiseSkillUsage && deviceWiseSkillUsage.length ? (
            <Container>
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
            <DefaultMessage>
              No device wise usage data available.
            </DefaultMessage>
          )}
        </UsageContainer>
        <UsageContainer>
          <SubTitle>Country wise Usage</SubTitle>
          <CountryWiseSkillUsageCard
            countryWiseSkillUsage={countryWiseSkillUsage}
          />
        </UsageContainer>
      </Paper>
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

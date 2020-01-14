import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart as Chart,
  Line,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  border: 1px solid rgb(204, 204, 204);
  height: auto;
  padding: 0 1rem;
`;

const LineChart = props => {
  const {
    data,
    legend,
    XAxisdataKey = 'timestamp',
    width = '100%',
    yAxisProps,
    margin,
    lineKey = 'count',
    customTooltip = false,
  } = props;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <TooltipContainer>
          <p style={{ padding: '0', margin: '0' }}>{`Date: ${label}`}</p>
          <p
            style={{ color: '#82ca9d', padding: '0', margin: '0' }}
          >{`${payload[0].name}: ${payload[0].value}`}</p>
        </TooltipContainer>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
  };

  return (
    <ResponsiveContainer height={300} width={width} debounce={1}>
      <Chart data={data} margin={margin}>
        <XAxis dataKey={XAxisdataKey} padding={{ right: 20 }} />
        <YAxis allowDecimals={false} {...yAxisProps} />
        <YAxis allowDecimals={false} />
        {customTooltip ? <Tooltip content={<CustomTooltip />} /> : <Tooltip />}
        <Legend />
        <Line
          name={legend}
          type="monotone"
          dataKey={lineKey}
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
      </Chart>
    </ResponsiveContainer>
  );
};

LineChart.propTypes = {
  data: PropTypes.array,
  legend: PropTypes.string,
  XAxisdataKey: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  yAxisProps: PropTypes.object,
  lineKey: PropTypes.string,
  margin: PropTypes.object,
  customTooltip: PropTypes.bool,
};

export default LineChart;

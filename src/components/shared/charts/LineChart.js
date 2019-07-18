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

const LineChart = props => {
  const {
    data,
    legend,
    XAxisdataKey = 'timestamp',
    width = '100%',
    yAxisProps,
    margin,
    lineKey = 'count',
  } = props;
  return (
    <ResponsiveContainer height={300} width={width} debounce={1}>
      <Chart data={data} margin={margin}>
        <XAxis dataKey={XAxisdataKey} padding={{ right: 20 }} />
        <YAxis allowDecimals={false} {...yAxisProps} />
        <YAxis allowDecimals={false} />
        <Tooltip wrapperStyle={{ height: '60px' }} />
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
  width: PropTypes.string,
  yAxisProps: PropTypes.object,
  lineKey: PropTypes.string,
  margin: PropTypes.object,
};

export default LineChart;

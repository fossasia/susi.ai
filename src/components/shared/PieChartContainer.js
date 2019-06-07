import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Legend, PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

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
class PieChartContainer extends Component {
  static propTypes = {
    cellData: PropTypes.array,
    data: PropTypes.array,
    showLegend: PropTypes.boolean,
  };

  state = {
    activePieIndex: 0,
  };

  onPieEnter = (cell, index) => {
    this.setState({
      activePieIndex: index,
    });
  };

  render() {
    const { activePieIndex } = this.state;
    const { cellData, data, showLegend = true, ...otherProps } = this.props;
    return (
      <ResponsiveContainer width={600} height={350}>
        <PieChart>
          <Pie
            activeIndex={activePieIndex}
            activeShape={renderActiveShape}
            data={data}
            cx={300}
            cy={175}
            innerRadius={80}
            nameKey="deviceType"
            dataKey="count"
            outerRadius={120}
            fill="#8884d8"
            onMouseEnter={this.onPieEnter}
            {...otherProps}
          >
            {cellData}
          </Pie>
          {showLegend ? (
            <Legend wrapperStyle={{ position: 'relative' }} />
          ) : null}
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
export default PieChartContainer;

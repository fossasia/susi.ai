import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Cell,
  LabelList,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const SkillRatingPopover = props => {
  const {
    oneStar,
    twoStar,
    threeStar,
    fourStar,
    fiveStar,
    avgStar,
    totalStar,
  } = props.stars;

  const skillRatings = [
    { name: '5.0 ⭐', value: fiveStar },
    { name: '4.0 ⭐', value: fourStar },
    { name: '3.0 ⭐', value: threeStar },
    { name: '2.0 ⭐', value: twoStar },
    { name: '1.0 ⭐', value: oneStar },
  ];
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        {avgStar} out of 5 stars
      </div>
      <ResponsiveContainer width={220} height={140}>
        <BarChart layout="vertical" data={skillRatings}>
          <XAxis type="number" hide={true} />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
          />
          <Bar
            name="Skill Rating"
            background={true}
            barSize={20}
            dataKey="value"
          >
            <LabelList position="insideLeft" fill="#666666" offset={130} />
            {skillRatings.map((entry, index) => (
              <Cell key={index} fill="#FDBA3C" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {totalStar > 1 && (
        <div style={{ textAlign: 'center' }}>See all {totalStar} reviews</div>
      )}
      {totalStar < 1 && (
        <div style={{ textAlign: 'center' }}>See the review</div>
      )}
    </div>
  );
};

SkillRatingPopover.propTypes = {
  stars: PropTypes.object,
};

export default SkillRatingPopover;

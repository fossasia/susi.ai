import React from 'react';
import ContentLoader from 'react-content-loader';

const TableSleletonRow = props => {
  return (
    <ContentLoader
      height={40}
      width={1060}
      speed={2}
      primaryColor="#d9d9d9"
      secondaryColor="#ecebeb"
      {...props}
    >
      <rect x="34" y="13" rx="6" ry="6" width={200} height="12" />
      <rect x="653" y="13" rx="6" ry="6" width={78} height="12" />
      <rect x="755" y="13" rx="6" ry="6" width={117} height="12" />
      <rect x="938" y="13" rx="6" ry="6" width={83} height="12" />

      <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3" />
    </ContentLoader>
  );
};

const TableSleleton = () => (
  <React.Fragment>
    <ContentLoader
      height={40}
      width={1000}
      speed={2}
      primaryColor="#d9d9d9"
      secondaryColor="#ecebeb"
    >
      <rect x="9" y="10" rx="0" ry="0" width="980" height="28" />
    </ContentLoader>
    {Array(7)
      .fill('')
      .map((e, i) => (
        <TableSleletonRow
          key={i}
          style={{ opacity: Number(2 / i).toFixed(1) }}
        />
      ))}
  </React.Fragment>
);

export default TableSleleton;

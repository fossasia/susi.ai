import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

const ToolTip = ({ title, children }) => {
  return (
    <Tooltip
      placement="bottom"
      title={title}
      PopperProps={{
        popperOptions: {
          modifiers: {
            offset: {
              enabled: true,
              offset: '0px, -30px',
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

ToolTip.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default ToolTip;

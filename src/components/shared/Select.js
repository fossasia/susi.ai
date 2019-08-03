import React from 'react';
import SelectMUI from '@material-ui/core/Select';

const Select = props => (
  <SelectMUI
    MenuProps={{
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      transformOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      getContentAnchorEl: null,
    }}
    {...props}
  />
);

export default Select;

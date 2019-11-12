import React from 'react';
import _Chip from '@material-ui/core/Chip';
import _PeopleIcon from '@material-ui/icons/People';
import styled from 'styled-components';

const StaffChip = styled(_Chip)`
  background-color: #f9a602;
  color: white;
`;

const PeopleIcon = styled(_PeopleIcon)`
  color: white;
`;

export const StaffPickBadge = () => {
  return (
    <StaffChip
      size="small"
      icon={<PeopleIcon />}
      label="Staff Pick"
      style={{
        margin: '5px 0px',
        padding: '2px',
      }}
    />
  );
};

import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  padding: 0 4rem;
  background-color: #f7f7f7;
`;

const ReportPanel = ({ reports = [] }) => {
  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email ID</TableCell>
            <TableCell>Feedback</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map(({ email, feedback }) => (
            <TableRow key={email}>
              <TableCell>{email}</TableCell>
              <TableCell>{feedback}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

ReportPanel.propTypes = {
  reports: PropTypes.array,
};

export default ReportPanel;

import React from 'react';
import MaterialTable from 'material-table';
import TABLE_CONFIG from './table-config';
import MESSAGE_CONFIG from './message-config';
import uiActions from '../../../redux/actions/ui';
import { ActionDiv } from '../../shared/TableActionStyles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OutlinedTextField from '../../shared/OutlinedTextField';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DialogTitle } from '@material-ui/core';

const StyledDiv = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.38);
  padding: 18.5px 14px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.38);
  text-align: left;
  font-size: 1rem;
`;

const Text = styled.span`
  left: -210px;
  top: 10px;
  background: white;
  padding: 0 4px;
  position: relative;
  color: rgba(0, 0, 0, 0.38);
  letter-spacing: 0.15008px;
  font-size: 12px;
`;

const generateRowsOption = total => {
  let array = [];
  for (let i = Math.max(10, total); i <= total; i += 10) {
    array.push(i);
  }
  return array;
};

const Messages = ({ actions }) => {
  const handleView = (recipients, subject, email, userMessage) => {
    actions.openModal({
      modalType: 'showMessage',
      content: (
        <div style={{ marginTop: '-1rem' }}>
          <OutlinedTextField
            label={'On-screen Message'}
            value={`${userMessage.toString()}`}
            fullWidth={true}
            disabled
          />
          <DialogTitle>Email Message</DialogTitle>
          <OutlinedTextField
            label={'Recipient type'}
            value={`${recipients.toString()}`}
            fullWidth={true}
            disabled
          />
          <OutlinedTextField
            label={'Subject'}
            value={subject}
            fullWidth={true}
            disabled
          />
          <Text>Email Text</Text>
          <StyledDiv>{email}</StyledDiv>
        </div>
      ),
      title: 'On Screen Message',
      handleConfirm: actions.closeModal,
    });
  };

  return (
    <MaterialTable
      options={{
        actionsColumnIndex: -1,
        pageSize: Math.max(10, MESSAGE_CONFIG.length),
        pageSizeOptions: [...generateRowsOption(MESSAGE_CONFIG.length)],
      }}
      columns={TABLE_CONFIG}
      data={MESSAGE_CONFIG}
      title=""
      style={{
        padding: '1rem',
        margin: '2rem',
      }}
      actions={[
        rowData => ({
          onClick: (event, rowData) => {
            handleView(
              rowData.recipients,
              rowData.subject,
              rowData.email,
              rowData.userMessage,
            );
          },
        }),
      ]}
      components={{
        /* eslint-disable */
        Action: props => (
          <ActionDiv onClick={event => props.action.onClick(event, props.data)}>
            View
          </ActionDiv>
        ),
      }}
    />
  );
};

Messages.propTypes = {
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(Messages);

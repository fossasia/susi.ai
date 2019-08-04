import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import uiActions from '../../../../redux/actions/ui';
import { fetchApiKeys, deleteApiKey } from '../../../../apis/index';
import { ActionSpan, ActionSeparator } from '../../../shared/TableActionStyles';
import MaterialTable from 'material-table';
import TABLE_CONFIG from './table-config';

const AddConfigButton = styled(Button)`
  margin-top: 1rem;
`;

class ConfigKeys extends React.Component {
  state = {
    apiKeys: [],
    loading: true,
    keyName: '',
    keyValue: '',
  };

  confirmUpdate = () => {
    this.fetchApiKeys();
    this.props.actions.closeModal();
  };

  confirmDelete = () => {
    const { keyName } = this.state;
    deleteApiKey({ keyName })
      .then(this.fetchApiKeys)
      .catch(error => {
        console.log(error);
      });
    this.props.actions.closeModal();
  };

  handleUpdate = (keyName, value) => {
    this.props.actions.openModal({
      modalType: 'updateSystemSettings',
      type: 'Update',
      keyName: keyName,
      keyValue: value,
      handleConfirm: this.confirmUpdate,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleCreate = () => {
    this.props.actions.openModal({
      modalType: 'createSystemSettings',
      type: 'Create',
      handleConfirm: this.confirmUpdate,
      keyName: '',
      keyValue: '',
      handleClose: this.props.actions.closeModal,
    });
  };

  handleDelete = keyName => {
    this.setState({ keyName: keyName });
    this.props.actions.openModal({
      modalType: 'deleteSystemSettings',
      name: keyName,
      handleConfirm: this.confirmDelete,
      handleClose: this.props.actions.closeModal,
    });
  };

  componentDidMount() {
    this.fetchApiKeys();
  }

  fetchApiKeys = () => {
    fetchApiKeys()
      .then(payload => {
        let apiKeys = [];
        let i = 1;
        let keys = Object.keys(payload.keys);
        keys.forEach(j => {
          const apiKey = {
            serialNum: i,
            keyName: j,
            value: payload.keys[j],
          };
          ++i;
          apiKeys.push(apiKey);
        });
        this.setState({
          apiKeys: apiKeys,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { apiKeys, loading } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          isLoading={loading}
          options={{
            actionsColumnIndex: -1,
            paging: false,
          }}
          columns={TABLE_CONFIG}
          data={apiKeys}
          title=""
          style={{
            padding: '1rem',
            margin: '2rem',
          }}
          actions={[
            {
              onEdit: (event, rowData) => {
                this.handleUpdate(rowData.keyName, rowData.value);
              },
              onDelete: (event, rowData) => {
                this.handleDelete(rowData.keyName);
              },
            },
          ]}
          components={{
            Action: props => (
              <React.Fragment>
                <ActionSpan
                  onClick={event => props.action.onEdit(event, props.data)}
                >
                  Edit
                </ActionSpan>
                <ActionSeparator> | </ActionSeparator>
                <ActionSpan
                  onClick={event => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionSpan>
              </React.Fragment>
            ),
          }}
        ></MaterialTable>
        <AddConfigButton
          variant="contained"
          color="primary"
          onClick={this.handleCreate}
        >
          Add Config Key
        </AddConfigButton>
      </React.Fragment>
    );
  }
}

ConfigKeys.propTypes = {
  history: PropTypes.object,
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
)(ConfigKeys);

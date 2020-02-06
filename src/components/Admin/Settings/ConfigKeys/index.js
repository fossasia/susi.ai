import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import uiActions from '../../../../redux/actions/ui';
import { fetchApiKeys, deleteApiKey } from '../../../../apis/index';
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
    const { apiType } = this.props;
    this.fetchApiKeys({ apiType });
    this.props.actions.closeModal();
  };

  confirmDelete = async () => {
    const { apiType } = this.props;
    const { keyName } = this.state;
    try {
      await deleteApiKey({ keyName, apiType });
      this.fetchApiKeys({ apiType });
    } catch (error) {
      console.log(error);
    }

    this.props.actions.closeModal();
  };

  handleUpdate = (keyName, value) => {
    this.props.actions.openModal({
      modalType: 'updateSystemSettings',
      type: 'Update',
      keyName: keyName,
      keyValue: value,
      apiType: this.props.apiType,
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
      apiType: this.props.apiType,
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
    const { apiType } = this.props;
    this.fetchApiKeys({ apiType });
  }

  fetchApiKeys = async ({ apiType }) => {
    try {
      let payload = await fetchApiKeys({ apiType });
      let apiKeys = [];
      let keys = Object.keys(payload.keys);
      keys.forEach(j => {
        const apiKey = {
          keyName: j,
          value: payload.keys[j].value,
        };
        apiKeys.push(apiKey);
      });
      this.setState({
        apiKeys: apiKeys,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
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
          }}
          actions={[
            rowData => ({
              icon: 'update',
              tooltip: 'Update Key',
              onClick: (event, rowData) =>
                this.handleUpdate(rowData.keyName, rowData.value),
            }),
            rowData => ({
              icon: 'delete',
              tooltip: 'Delete Key',
              onClick: (event, rowData) => this.handleDelete(rowData.keyName),
            }),
          ]}
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
  apiType: PropTypes.string,
};

ConfigKeys.defaultProps = {
  apiType: 'public',
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

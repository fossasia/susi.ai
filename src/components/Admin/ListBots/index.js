import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import { fetchBots } from '../../../apis/index';
import { BOT } from './constants';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';
import { deleteChatBot } from '../../../apis/index';

class ListBots extends React.Component {
  state = {
    bots: [],
    loadingBots: true,
    group: '',
    language: '',
    name: '',
    uuid: '',
  };

  componentDidMount() {
    this.loadBots();
  }

  loadBots = () => {
    fetchBots()
      .then(payload => {
        const { chatbots } = payload;
        this.setState({ loadingBots: false, bots: chatbots });
      })
      .catch(error => {
        console.log(error);
      });
  };

  confirmDelete = () => {
    const { actions } = this.props;
    const { group, language, name, uuid } = this.state;
    deleteChatBot({ group, language, skill: name, uuid })
      .then(payload => {
        actions.openSnackBar({
          snackBarMessage: `Successfully ${payload.message}`,
          snackBarDuration: 2000,
        });
        actions.closeModal();
        this.setState({
          loadingBots: true,
        });
        this.loadBots();
      })
      .catch(error => {
        actions.openSnackBar({
          snackBarMessage: `Unable to delete chatbot ${name}. Please try again.`,
          snackBarDuration: 2000,
        });
      });
  };

  handleDelete = (name, language, group, uuid) => {
    this.setState({
      group,
      language,
      name,
      uuid,
    });
    this.props.actions.openModal({
      modalType: 'deleteBot',
      handleConfirm: this.confirmDelete,
      name,
      handleClose: this.props.actions.closeModal,
    });
  };

  render() {
    const { loadingBots, bots } = this.state;
    return (
      <MaterialTable
        isLoading={loadingBots}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
        }}
        columns={BOT}
        data={bots}
        title=""
        style={{
          padding: '1rem',
        }}
        actions={[
          {
            onDelete: (event, rowData) => {
              this.handleDelete(
                rowData.name,
                rowData.language,
                rowData.group,
                rowData.key,
              );
            },
          },
        ]}
        components={{
          Action: props => (
            <React.Fragment>
              <Link
                to={
                  '/botWizard?name=' +
                  props.data.name +
                  '&language=' +
                  props.data.language +
                  '&group=' +
                  props.data.group
                }
              >
                <ActionSpan>View</ActionSpan>
              </Link>
              <ActionSeparator> | </ActionSeparator>
              <ActionSpan
                onClick={event => props.action.onDelete(event, props.data)}
              >
                Delete
              </ActionSpan>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

ListBots.propTypes = {
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
)(ListBots);

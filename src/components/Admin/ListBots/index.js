import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import uiActions from '../../../redux/actions/ui';
import { Link } from 'react-router-dom';
import MaterialTable from 'material-table';
import { BOT } from './constants';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Container } from '../AdminStyles';
import { ActionSpan, ActionSeparator } from '../../shared/TableActionStyles';
import { deleteChatBot, fetchBots } from '../../../apis/index';

class ListBots extends React.Component {
  state = {
    bots: [],
    loadingBots: true,
    group: '',
    language: '',
    name: '',
    uuid: '',
    value: 0,
  };

  componentDidMount() {
    this.loadBots();
  }

  loadBots = async () => {
    try {
      let payload = await fetchBots();
      const { chatbots } = payload;
      let bots = [];
      chatbots.forEach(chatBot => {
        const { configure } = chatBot;
        chatBot.displaySkills = configure.enableDefaultSkills
          ? 'true'
          : 'false';
        let allowedSites =
          configure.allowBotOnlyOnOwnSites && configure.allowedSites;
        let botSites = [];

        if (allowedSites) {
          allowedSites = allowedSites.split(',');
          allowedSites.forEach(site => {
            botSites.push(
              <li>
                <a href={site} target="_blank" rel="noopener noreferrer">
                  {site}
                </a>
              </li>,
            );
          });
        }

        chatBot.botSite = botSites.length > 0 ? botSites : '-';
        bots.push(chatBot);
      });
      this.setState({ loadingBots: false, bots });
    } catch (error) {
      console.log(error);
    }
  };

  confirmDelete = async () => {
    const { actions } = this.props;
    const { group, language, name, uuid } = this.state;

    try {
      let payload = await deleteChatBot({ group, language, skill: name, uuid });
      actions.openSnackBar({
        snackBarMessage: `Successfully ${payload.message}`,
        snackBarDuration: 2000,
      });
      actions.closeModal();
      this.setState({
        loadingBots: true,
      });
      this.loadBots();
    } catch (error) {
      actions.openSnackBar({
        snackBarMessage: `Unable to delete chatbot ${name}. Please try again.`,
        snackBarDuration: 2000,
      });
    }
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

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { loadingBots, bots, value } = this.state;
    return (
      <Container>
        <Tabs onChange={this.handleTabChange} value={value}>
          <Tab label="Active" />
        </Tabs>
        {value === 0 && (
          <MaterialTable
            isLoading={loadingBots}
            options={{
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            columns={BOT}
            data={bots}
            title=""
            actions={[
              rowData => ({
                onDelete: (event, rowData) => {
                  this.handleDelete(
                    rowData.name,
                    rowData.language,
                    rowData.group,
                    rowData.key,
                  );
                },
              }),
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
        )}
      </Container>
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

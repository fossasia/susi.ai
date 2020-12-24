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

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => {
    return <ChevronRight {...props} ref={ref} />;
  }),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => {
    return <ChevronLeft {...props} ref={ref} />;
  }),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

tableIcons.Add.displayName = 'Add';
tableIcons.Check.displayName = 'Check';
tableIcons.Clear.displayName = 'Clear';
tableIcons.Delete.displayName = 'Delete';
tableIcons.DetailPanel.displayName = 'DetailPanel';
tableIcons.Edit.displayName = 'Edit';
tableIcons.Export.displayName = 'Export';
tableIcons.Filter.displayName = 'Filter';
tableIcons.FirstPage.displayName = 'FirstPage';
tableIcons.LastPage.displayName = 'LastPage';
tableIcons.NextPage.displayName = 'NextPage';
tableIcons.PreviousPage.displayName = 'PreviousPage';
tableIcons.ResetSearch.displayName = 'ResetSearch';
tableIcons.Search.displayName = 'Search';
tableIcons.SortArrow.displayName = 'SortArrow';
tableIcons.ThirdStateCheck.displayName = 'ThirdStateCheck';
tableIcons.ViewColumn.displayName = 'ViewColumn';

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
      chatbots.forEach((chatBot) => {
        const { configure } = chatBot;
        chatBot.displaySkills = configure.enableDefaultSkills
          ? 'true'
          : 'false';
        let allowedSites =
          configure.allowBotOnlyOnOwnSites && configure.allowedSites;
        let botSites = [];

        if (allowedSites) {
          allowedSites = allowedSites.split(',');
          allowedSites.forEach((site) => {
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
              pageSize: 25,
              pageSizeOptions: [25, 50, 100, 200, 500],
            }}
            icons={tableIcons}
            columns={BOT}
            data={bots}
            title=""
            actions={[
              (rowData) => ({
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
              Action: (props) => (
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
                    onClick={(event) =>
                      props.action.onDelete(event, props.data)
                    }
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

export default connect(null, mapDispatchToProps)(ListBots);

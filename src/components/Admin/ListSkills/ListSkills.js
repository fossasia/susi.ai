/* Packages */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Material UI */
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MaterialTable from 'material-table';
import { fetchReportedSkills } from '../../../apis/index';

/* Utils */
import uiActions from '../../../redux/actions/ui';
import {
  changeSkillStatus,
  undoDeleteSkill,
  skillsToBeDeleted,
  fetchGroupOptions,
  deleteSkill,
  fetchUserSkill,
} from '../../../apis/index';
import { getColumnConfig } from './constants';
import PropTypes from 'prop-types';
import { Container } from '../AdminStyles';
import { ActionDiv } from '../../shared/TableActionStyles';
import ReportPanel from './ReportPanel';
import SkillTable from './SkillTable';

class ListSkills extends React.Component {
  state = {
    skillsData: [],
    groups: {},
    deletedSkills: [],
    loading: true,
    loadingReportedSkills: true,
    skillName: '',
    skillTag: '',
    skillModel: '',
    skillGroup: '',
    skillLanguage: '',
    skillReviewStatus: false,
    skillEditStatus: true,
    skillStaffPickStatus: false,
    systemSkillStatus: false,
    value: 0,
    reportedSkills: [],
    systemSkills: [],
  };

  componentDidMount() {
    this.loadSkills();
    this.loadGroups();
    this.loadDeletedSkills();
    this.loadReportedSkill();
  }

  changeStatus = async (
    skillReviewStatus,
    skillEditStatus,
    skillStaffPickStatus,
    systemSkillStatus,
  ) => {
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillTag: skill,
    } = this.state;

    try {
      // eslint-disable-next-line no-unused-vars
      let payload = await changeSkillStatus({
        model,
        group,
        language,
        skill,
        reviewed: skillReviewStatus,
        editable: skillEditStatus,
        staffPick: skillStaffPickStatus,
        systemSkill: systemSkillStatus,
      });

      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Success',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            Status of <b>{skill}</b> has been changed successfully!
          </p>
        ),
      });
    } catch (error) {
      console.log(error);
      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Failed',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            Error! Status of <b>{skill}</b> could not be changed!
          </p>
        ),
      });
    }
  };

  deleteSkill = async () => {
    this.setState({ loading: true });
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: skill,
    } = this.state;
    try {
      // eslint-disable-next-line no-unused-vars
      let payload = await deleteSkill({ model, group, language, skill });
      this.setState({ loading: false });
      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Success',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            You successfully deleted <b>{skill}</b>!
          </p>
        ),
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Failed',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            Error! <b>{skill}</b> could not be deleted!
          </p>
        ),
      });
    }
  };

  restoreSkill = async () => {
    this.setState({ loading: true });
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: skill,
    } = this.state;
    try {
      // eslint-disable-next-line no-unused-vars
      let payload = await undoDeleteSkill({ model, group, language, skill });
      this.setState({ loading: false });
      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Success',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            You successfully restored <b>{skill}</b>!
          </p>
        ),
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      this.props.actions.openModal({
        modalType: 'confirm',
        title: 'Failed',
        handleConfirm: this.props.actions.closeModal,
        content: (
          <p>
            Error! <b>{skill}</b> could not be restored!
          </p>
        ),
      });
    }
  };

  loadReportedSkill = async () => {
    let skills = [];
    try {
      let { list } = await fetchReportedSkills();
      for (let skillMetadata of list) {
        let skill = {
          skillName: skillMetadata.skillName,
          model: skillMetadata.model,
          group: skillMetadata.group,
          language: skillMetadata.language,
          type: 'public',
          author: skillMetadata.author,
          reviewed: skillMetadata.reviewed ? 'Approved' : 'Not Reviewed',
          editable: skillMetadata.editable ? 'Editable' : 'Not Editable',
        };
        skills.push(skill);
      }
      this.setState({ loadingReportedSkills: false, reportedSkills: skills });
    } catch (error) {
      console.log(error, 'Error');
    }
  };

  loadDeletedSkills = async () => {
    let deletedSkills = [];
    try {
      let { skills } = await skillsToBeDeleted();
      for (let skillMetadata of skills) {
        let skill = {
          skillName: skillMetadata.skillName,
          model: skillMetadata.model,
          group: skillMetadata.group,
          language: skillMetadata.language,
          type: 'public',
          author: skillMetadata.author,
          reviewed: skillMetadata.reviewed ? 'Approved' : 'Not Reviewed',
          editable: skillMetadata.editable ? 'Editable' : 'Not Editable',
        };
        deletedSkills.push(skill);
      }
      this.setState({ deletedSkills: skills });
    } catch (error) {
      console.log(error, 'Error');
    }
  };

  loadGroups = async () => {
    try {
      let payload = await fetchGroupOptions();
      let groups = {};
      if (payload) {
        for (let i of payload.groups) {
          groups = { ...groups, [i]: i };
        }
      }
      this.setState({
        groups,
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadSkills = async () => {
    const { actions } = this.props;
    try {
      let payload = await fetchUserSkill({
        filterName: 'ascending',
        filterType: 'lexicographical',
      });
      let skills = [];
      let systemSkills = [];
      if (payload) {
        const { filteredData } = payload;
        for (let skillMetadata of filteredData) {
          let skill = {
            skillName: skillMetadata.skillName,
            model: skillMetadata.model,
            group: skillMetadata.group,
            language: skillMetadata.language,
            skillTag: skillMetadata.skillTag,
            reviewStatus: skillMetadata.reviewed,
            editStatus: skillMetadata.editable,
            staffPickStatus: skillMetadata.staffPick,
            systemSkillStatus: skillMetadata.systemSkill,
            type: 'public',
            author: skillMetadata.author,
            reviewed: skillMetadata.reviewed ? 'Approved' : 'Not Reviewed',
            editable: skillMetadata.editable ? 'Editable' : 'Not Editable',
          };
          skills.push(skill);
          if (skillMetadata.systemSkill) {
            systemSkills.push(skill);
          }
        }
      }
      this.setState({
        skillsData: skills,
        loading: false,
        systemSkills,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      actions.openSnackBar({
        snackBarMessage: "Error. Couldn't fetch skills.",
        snackBarDuration: 2000,
      });
    }
  };

  handleChange = (
    skillReviewStatus,
    skillEditStatus,
    skillStaffPickStatus,
    systemSkillStatus,
  ) => {
    this.changeStatus(
      skillReviewStatus,
      skillEditStatus,
      skillStaffPickStatus,
      systemSkillStatus,
    );
  };

  confirmDelete = () => {
    this.deleteSkill();
  };

  confirmRestore = () => {
    this.restoreSkill();
  };

  handleDelete = (name, model, group, language) => {
    this.setState({
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: name,
    });
    this.props.actions.openModal({
      modalType: 'deleteSkill',
      handleConfirm: this.confirmDelete,
      name,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleRestore = (name, model, group, language) => {
    this.setState({
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: name,
    });
    this.props.actions.openModal({
      modalType: 'restoreSkill',
      handleConfirm: this.confirmRestore,
      name,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleOpen = (
    name,
    model,
    group,
    language,
    reviewStatus,
    editStatus,
    staffPickStatus,
    systemSkillStatus,
    skillTag,
  ) => {
    this.setState({
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: name,
      skillTag: skillTag,
      skillReviewStatus: reviewStatus,
      skillEditStatus: editStatus,
      skillStaffPickStatus: staffPickStatus,
      systemSkillStatus: systemSkillStatus,
    });
    this.props.actions.openModal({
      modalType: 'editSkill',
      skillReviewStatus: reviewStatus,
      skillEditStatus: editStatus,
      skillStaffPickStatus: staffPickStatus,
      systemSkillStatus: systemSkillStatus,
      handleConfirm: this.handleChange,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleFinish = () => {
    window.location.reload();
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  handleDeleteReportSkill = (skillName, email, feedback) => {};

  render() {
    const {
      groups,
      loading,
      value,
      reportedSkills,
      loadingReportedSkills,
      skillsData,
      deletedSkills,
      systemSkills,
    } = this.state;

    return (
      <Container>
        <Tabs onChange={this.handleTabChange} value={value}>
          <Tab label="Active" />
          <Tab label="System" />
          <Tab label="Deleted" />
          <Tab label="Reported" />
        </Tabs>
        {value === 3 && (
          <MaterialTable
            isLoading={loadingReportedSkills}
            options={{
              filtering: true,
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            columns={getColumnConfig(groups)}
            data={reportedSkills}
            title=""
            style={{
              padding: '1rem',
            }}
            actions={[
              rowData => ({
                onDelete: (event, rowData) => {
                  this.handleDelete(
                    rowData.skillName,
                    rowData.model,
                    rowData.group,
                    rowData.language,
                  );
                },
              }),
            ]}
            components={{
              Action: props => (
                <ActionDiv
                  onClick={event => props.action.onDelete(event, props.data)}
                >
                  Delete
                </ActionDiv>
              ),
            }}
            detailPanel={rowData => {
              return <ReportPanel reports={rowData.reports} />;
            }}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
          />
        )}
        {value === 2 && (
          <MaterialTable
            isLoading={loading}
            options={{
              filtering: true,
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            columns={getColumnConfig(groups)}
            data={deletedSkills}
            title=""
            style={{
              padding: '1rem',
            }}
            actions={[
              rowData => ({
                onClick: (event, rowData) => {
                  this.handleRestore(
                    rowData.skillName,
                    rowData.model,
                    rowData.group,
                    rowData.language,
                  );
                },
              }),
            ]}
            components={{
              Action: props => (
                <ActionDiv
                  onClick={event => props.action.onClick(event, props.data)}
                >
                  Restore
                </ActionDiv>
              ),
            }}
          />
        )}
        {value === 1 && (
          <SkillTable
            loading={loading}
            groups={groups}
            data={systemSkills}
            handleOpen={this.handleOpen}
            handleDelete={this.handleDelete}
          />
        )}
        {value === 0 && (
          <SkillTable
            loading={loading}
            groups={groups}
            data={skillsData}
            handleOpen={this.handleOpen}
            handleDelete={this.handleDelete}
          />
        )}
      </Container>
    );
  }
}

ListSkills.propTypes = {
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
)(ListSkills);

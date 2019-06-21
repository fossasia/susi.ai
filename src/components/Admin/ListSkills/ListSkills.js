/* Packages */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Material UI */
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MaterialTable from 'material-table';

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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Container } from '../AdminStyles';

const commonActionStyle = css`
  cursor: pointer;
  color: #49a9ee;
`;

const ActionSpan = styled.span`
  ${commonActionStyle};
`;

const ActionDiv = styled.div`
  ${commonActionStyle};
`;

const ActionSeparator = styled.span`
  margin-left: 0.313rem;
  margin-right: 0.313rem;
`;

class ListSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsData: [],
      groups: {},
      deletedSkills: [],
      loading: true,
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
    };
  }

  componentDidMount() {
    this.loadSkills();
    this.loadGroups();
    this.loadDeletedSkills();
  }

  changeStatus = () => {
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillTag: skill,
      skillReviewStatus: reviewed,
      skillEditStatus: editable,
      skillStaffPickStatus: staffPick,
      systemSkillStatus: systemSkill,
    } = this.state;

    changeSkillStatus({
      model,
      group,
      language,
      skill,
      reviewed,
      editable,
      staffPick,
      systemSkill,
    })
      .then(payload => {
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              Status of <b>{skill}</b> has been changed successfully!
            </p>
          ),
        });
      })
      .catch(error => {
        console.log(error);
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Failed',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              Error! Status of <b>{skill}</b> could not be changed!
            </p>
          ),
        });
      });
  };

  deleteSkill = () => {
    this.setState({ loading: true });
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: skill,
    } = this.state;
    deleteSkill({ model, group, language, skill })
      .then(payload => {
        this.setState({ loading: false });
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              You successfully deleted <b>{skill}</b>!
            </p>
          ),
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Failed',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              Error! <b>{skill}</b> could not be deleted!
            </p>
          ),
        });
      });
  };

  restoreSkill = () => {
    this.setState({ loading: true });
    const {
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: skill,
    } = this.state;
    undoDeleteSkill({ model, group, language, skill })
      .then(payload => {
        this.setState({ loading: false });
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Success',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              You successfully restored <b>{skill}</b>!
            </p>
          ),
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
        this.props.actions.openModal({
          modalType: 'confirmSkill',
          title: 'Failed',
          handleConfirm: this.props.actions.closeModal,
          skillName: skill,
          content: (
            <p>
              Error! <b>{skill}</b> could not be restored!
            </p>
          ),
        });
      });
  };

  loadDeletedSkills = () => {
    let deletedSkills = [];
    skillsToBeDeleted()
      .then(payload => {
        const { skills } = payload;
        for (let deletedSkillPath of skills) {
          const current = deletedSkillPath.slice(
            deletedSkillPath.indexOf('/models/') + 8,
            deletedSkillPath.length - 4,
          );
          const splitString = current.split('/');
          let deletedSkill = {
            model: splitString[0],
            group: splitString[1],
            language: splitString[2],
            skillName: splitString[3],
          };
          deletedSkills.push(deletedSkill);
        }
        this.setState({
          deletedSkills,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  loadGroups = () => {
    fetchGroupOptions()
      .then(payload => {
        let groups = {};
        if (payload) {
          for (let i of payload.groups) {
            groups = { ...groups, [i]: i };
          }
        }
        this.setState({
          groups,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  loadSkills = () => {
    const { actions } = this.props;
    fetchUserSkill({ filterName: 'ascending', filterType: 'lexicographical' })
      .then(payload => {
        let skills = [];
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
          }
        }

        this.setState({
          skillsData: skills,
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error. Couldn't fetch skills.",
          snackBarDuration: 2000,
        });
      });
  };

  handleChange = () => {
    this.changeStatus();
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
      skillName: name,
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
      skillName: name,
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
      handleChange: this.handleChange,
      handleClose: this.props.actions.closeModal,
    });
  };

  handleReviewStatusChange = () => {
    let value = !this.state.skillReviewStatus;
    this.setState({
      skillReviewStatus: value,
    });
  };

  handleEditStatusChange = () => {
    let value = !this.state.skillEditStatus;
    this.setState({
      skillEditStatus: value,
    });
  };

  handleStaffPickStatusChange = () => {
    let value = !this.state.skillStaffPickStatus;
    this.setState({
      skillStaffPickStatus: value,
    });
  };

  handleSystemSkillStatusChange = () => {
    let value = !this.state.systemSkillStatus;
    this.setState({
      systemSkillStatus: value,
    });
  };

  handleFinish = () => {
    window.location.reload();
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { groups, loading, value } = this.state;

    let columns = [
      {
        title: 'Name',
        field: 'skillName',
        cellStyle: {
          width: '20%',
        },
        filtering: false,
      },
      {
        title: 'Group',
        field: 'group',
        lookup: groups,
        cellStyle: {
          width: '10%',
        },
      },
      {
        title: 'Language',
        field: 'language',
        cellStyle: {
          width: '10%',
        },
        filtering: false,
      },
      {
        title: 'Type',
        field: 'type',
        lookup: { private: 'Private', public: 'Public' },
        cellStyle: {
          width: '10%',
        },
      },
      {
        title: 'Author',
        field: 'author',
        cellStyle: {
          width: '10%',
        },
        filtering: false,
      },
      {
        title: 'Review Status',
        field: 'reviewed',
        lookup: { Approved: 'Reviewed', 'Not Reviewed': 'Not Reviewed' },
        cellStyle: {
          width: '15%',
        },
      },
      {
        title: 'Edit Status',
        field: 'editable',
        lookup: { Editable: 'Editable', 'Not Editable': 'Not Editable' },
        cellStyle: {
          width: '15%',
        },
      },
    ];

    let delColumns = [
      {
        title: 'Name',
        field: 'skillName',
        cellStyle: {
          width: '30%',
        },
        filtering: false,
      },
      {
        title: 'Model',
        field: 'model',
        cellStyle: {
          width: '15%',
        },
        filtering: false,
      },
      {
        title: 'Group',
        field: 'group',
        cellStyle: {
          width: '25%',
        },
        lookup: groups,
      },
      {
        title: 'Language',
        field: 'language',
        filtering: false,
      },
    ];

    return (
      <Container>
        <Tabs onChange={this.handleTabChange} value={value}>
          <Tab label="Active" />
          <Tab label="Deleted" />
        </Tabs>
        {value === 1 && (
          <MaterialTable
            isLoading={loading}
            options={{
              filtering: true,
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            columns={delColumns}
            data={this.state.deletedSkills}
            title="Deleted Skills"
            style={{
              padding: '1rem',
            }}
            actions={[
              {
                onClick: (event, rowData) => {
                  this.handleRestore(
                    rowData.skillName,
                    rowData.model,
                    rowData.group,
                    rowData.language,
                  );
                },
              },
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
        {value === 0 && (
          <MaterialTable
            isLoading={loading}
            options={{
              filtering: true,
              actionsColumnIndex: -1,
              pageSize: 10,
            }}
            columns={columns}
            data={this.state.skillsData}
            title="Active Skills"
            style={{
              padding: '1rem',
            }}
            actions={[
              {
                onEdit: (event, rowData) => {
                  this.handleOpen(
                    rowData.skillName,
                    rowData.model,
                    rowData.group,
                    rowData.language,
                    rowData.reviewStatus,
                    rowData.editStatus,
                    rowData.staffPickStatus,
                    rowData.systemSkillStatus,
                    rowData.skillTag,
                  );
                },
                onDelete: (event, rowData) => {
                  this.handleDelete(
                    rowData.skillName,
                    rowData.model,
                    rowData.group,
                    rowData.language,
                  );
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

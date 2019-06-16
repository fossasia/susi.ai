/* Packages */
import React from 'react';
import Table from 'antd/lib/table';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

/* Material UI */
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

/* CSS */
import './ListSkills.css';

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
      groups: [],
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
              Status of <span className="skillName">{skill}</span> has been
              changed successfully!
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
              Error! Status of <span className="skillName">{skill}</span> could
              not be changed!
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
              You successfully deleted{' '}
              <span className="skillName">{skill}</span>!
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
              Error! <span className="skillName">${skill}</span> could not be
              deleted!
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
              You successfully restored{' '}
              <span className="skillName">{skill}</span>!
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
              Error! <span className="skillName">{skill}</span> could not be
              restored!
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
        let groups = [];
        if (payload) {
          for (let i of payload.groups) {
            let group = {
              text: i,
              value: i,
            };
            groups.push(group);
          }
        }
        this.setState({
          groups,
          loading: false,
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
        dataIndex: 'skillName',
        width: '20%',
      },
      {
        title: 'Group',
        dataIndex: 'group',
        filters: groups,
        onFilter: (value, record) => record.group.indexOf(value) === 0,
        sorter: (a, b) => a.group.length - b.group.length,
        width: '10%',
      },
      {
        title: 'Language',
        dataIndex: 'language',
        width: '10%',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        filters: [
          {
            text: 'Public',
            value: 'public',
          },
          {
            text: 'Private',
            value: 'private',
          },
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        sorter: (a, b) => a.type.length - b.type.length,
        width: '10%',
      },
      {
        title: 'Author',
        dataIndex: 'author',
        width: '10%',
      },
      {
        title: 'Review Status',
        dataIndex: 'reviewed',
        filters: [
          {
            text: 'Reviewed',
            value: 'Approved',
          },
          {
            text: 'Not Reviewed',
            value: 'Not Reviewed',
          },
        ],
        onFilter: (value, record) => record.reviewed.indexOf(value) === 0,
        sorter: (a, b) => a.reviewed.length - b.reviewed.length,
        width: '15%',
      },
      {
        title: 'Edit Status',
        dataIndex: 'editable',
        filters: [
          {
            text: 'Editable',
            value: 'Editable',
          },
          {
            text: 'Not Editable',
            value: 'Not Editable',
          },
        ],
        onFilter: (value, record) => record.editable.indexOf(value) === 0,
        sorter: (a, b) => a.editable.length - b.editable.length,
        width: '15%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: '10%',
        // eslint-disable-next-line
        render: (text, record) => {
          return (
            <span>
              <ActionSpan
                onClick={() =>
                  this.handleOpen(
                    record.skillName,
                    record.model,
                    record.group,
                    record.language,
                    record.reviewStatus,
                    record.editStatus,
                    record.staffPickStatus,
                    record.systemSkillStatus,
                    record.skillTag,
                  )
                }
              >
                Edit
              </ActionSpan>
              <ActionSeparator> | </ActionSeparator>
              <ActionSpan
                onClick={() =>
                  this.handleDelete(
                    record.skillName,
                    record.model,
                    record.group,
                    record.language,
                  )
                }
              >
                Delete
              </ActionSpan>
            </span>
          );
        },
      },
    ];

    let delColumns = [
      {
        title: 'Name',
        dataIndex: 'skillName',
        width: '20%',
      },
      {
        title: 'Model',
        dataIndex: 'model',
        width: '10%',
      },
      {
        title: 'Group',
        dataIndex: 'group',
        filters: groups,
        onFilter: (value, record) => record.group.indexOf(value) === 0,
        sorter: (a, b) => a.group.length - b.group.length,
        width: '15%',
      },
      {
        title: 'Language',
        dataIndex: 'language',
        width: '10%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: '10%',
        // eslint-disable-next-line
        render: (text, record) => {
          return (
            <span>
              <ActionDiv
                onClick={() =>
                  this.handleRestore(
                    record.skillName,
                    record.model,
                    record.group,
                    record.language,
                  )
                }
              >
                Restore
              </ActionDiv>
            </span>
          );
        },
      },
    ];

    return (
      <div className="tabs">
        <div>
          <div className="table">
            <Tabs onChange={this.handleTabChange} value={value}>
              <Tab label="Active" />
              <Tab label="Deleted" />
            </Tabs>
            {value === 1 && (
              <Table
                columns={delColumns}
                pagination={{ showQuickJumper: true }}
                rowKey={record => record.registered}
                dataSource={this.state.deletedSkills}
              />
            )}
            {value === 0 && (
              <React.Fragment>
                <Table
                  columns={columns}
                  pagination={{ showQuickJumper: true }}
                  rowKey={record => record.registered}
                  dataSource={this.state.skillsData}
                  loading={loading}
                />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
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

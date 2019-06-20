/* eslint-disable max-len */
// Packages
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchCommitHistory } from '../../../apis';
import { Link } from 'react-router-dom';

// Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import _Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';

// Other Utils
import { notification, Icon } from 'antd';
import 'antd/dist/antd.css';
import './SkillVersion.css';
import styled from 'styled-components';

notification.config({
  top: 60,
});

const HomeDiv = styled.div`
  font-size: 0.85rem;
  max-width: 1000px;
  white-space: pre-line;
  margin: 0rem auto;
`;

const Button = styled(_Button)`
  margin: 0.625rem;
`;

const ActionButtonDiv = styled.div`
  display: flex;
  justify-content: flex-end;
`;

class SkillVersion extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      commits: [],
      dataReceived: false,
      skillMeta: {
        modelValue: 'general',
        groupValue: this.props.location.pathname.split('/')[2],
        languageValue: this.props.location.pathname.split('/')[5],
        skillName: this.props.location.pathname.split('/')[3],
      },
      checks: [],
    };
  }

  componentDidMount() {
    document.title = 'SUSI.AI - Skill Version';
    this.getCommitHistory();
  }

  getCommitHistory = () => {
    const {
      modelValue: model,
      groupValue: group,
      languageValue: language,
      skillName: skill,
    } = this.state.skillMeta;
    console.log(this.state.skillMeta);
    fetchCommitHistory({ model, group, language, skill })
      .then(commitsData => {
        this.setCommitHistory(commitsData);
      })
      .catch(error => {
        notification.open({
          message: 'Error Processing your Request',
          description: 'Failed to fetch data. Please Try Again',
          icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
        });
        return 0;
      });
  };

  setCommitHistory = commitsData => {
    if (commitsData.accepted) {
      let commits = commitsData.commits ? commitsData.commits : [];
      this.setState({
        commits: commits,
        dataReceived: true,
      });
    }
  };

  getCheckedCommits = () => {
    const { commits, checks } = this.state;
    let checkedCommits = checks.map(check => commits[check]);
    return checkedCommits;
  };

  onCheck = e => {
    const { checks } = this.state;
    const { id, checked } = e.currentTarget;
    let currentChecks = [...checks];
    if (checked && currentChecks.length === 2) {
      notification.open({
        message: 'Error Processing your Request',
        description: 'Cannot compare more than 2 version at a time',
        icon: <Icon type="close-circle" style={{ color: '#f44336' }} />,
      });
    } else {
      let checks = checked
        ? [...currentChecks, id]
        : currentChecks.filter(check => check !== id);
      this.setState({
        checks: [...checks],
      });
    }
  };

  render() {
    const { commits, skillMeta, dataReceived, checks } = this.state;

    let commitHistoryTableHeader = (
      <TableRow>
        <TableCell padding="checkbox" />
        <TableCell padding="dense">Commit Date</TableCell>
        <TableCell padding="dense">Commit ID</TableCell>
        <TableCell padding="dense">Commit Author</TableCell>
        <TableCell padding="dense">Commit Message</TableCell>
      </TableRow>
    );

    let commitHistoryTableRows = commits.map((commit, index) => {
      const { commitId, commitDate, author, commitMessage } = commit;
      return (
        <TableRow key={index}>
          <TableCell padding="checkbox">
            <Checkbox
              id={index}
              checked={checks.indexOf(index.toString()) > -1}
              onChange={this.onCheck}
              color="primary"
            />
          </TableCell>
          <TableCell padding="dense">
            <Link
              to={{
                pathname: `/skills/${skillMeta.groupValue}/${skillMeta.skillName}/edit/${skillMeta.languageValue}/${commitId}`,
              }}
            >
              <abbr title={commitDate}>{commitDate}</abbr>
            </Link>
          </TableCell>
          <TableCell padding="dense">
            <abbr title={commitId}>{commitId}</abbr>
          </TableCell>
          <TableCell padding="dense">
            <abbr title={author}>{author}</abbr>
          </TableCell>
          <TableCell padding="dense">
            <abbr title={commitMessage}>{commitMessage}</abbr>
          </TableCell>
        </TableRow>
      );
    });

    const commitHistoryTable = (
      <Table
        selectable={false}
        style={{ maxWidth: '1000px', whiteSpace: 'pre-line' }}
      >
        <TableHead displaySelectAll={false} adjustForCheckbox={false}>
          {commitHistoryTableHeader}
        </TableHead>
        <TableBody displayRowCheckbox={false}>
          {commitHistoryTableRows}
        </TableBody>
      </Table>
    );

    const checkedCommits = this.getCheckedCommits();

    return (
      <div>
        {!dataReceived ? (
          <h1 className="skill_loading_container">
            <div className="center">
              <CircularProgress size={62} color="primary" />
              <h4>Loading</h4>
            </div>
          </h1>
        ) : (
          <HomeDiv>
            <div className="margin-b-md margin-t-md skill">
              <h1 style={{ display: 'flex' }}>
                <div style={{ textTransform: 'capitalize' }}>
                  {skillMeta.skillName.split('_').join(' ')}
                </div>
                :&nbsp;Revision History
              </h1>
              <p>
                <span>
                  For any version listed below, click on its date to view it.
                  You can compare only two versions at a time.
                </span>
              </p>
              <div style={{ margin: '0.625rem' }}>{commitHistoryTable}</div>
              <ActionButtonDiv>
                {checks.length === 2 && (
                  <Link
                    to={{
                      pathname: `/skills/${skillMeta.groupValue}/${skillMeta.skillName}/compare/${skillMeta.languageValue}/${checkedCommits[0].commitId}/${checkedCommits[1].commitId}`,
                    }}
                  >
                    <Button variant="contained" color="primary">
                      Compare Selected Versions
                    </Button>
                  </Link>
                )}
                <Link
                  to={{
                    pathname: `/skills/${skillMeta.groupValue}/${skillMeta.skillName}/${skillMeta.languageValue}`,
                  }}
                >
                  <Button variant="contained" color="primary">
                    Back
                  </Button>
                </Link>
              </ActionButtonDiv>
            </div>
          </HomeDiv>
        )}
      </div>
    );
  }
}

export default SkillVersion;

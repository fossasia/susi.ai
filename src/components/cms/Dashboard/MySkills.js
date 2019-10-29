/* eslint-disable max-len */
import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import PropTypes from 'prop-types';
import Link from '../../shared/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '../../shared/Button';
import CircularLoader from '../../shared/CircularLoader';
import FormControl from '@material-ui/core/FormControl';
import Select from '../../shared/Select';
import CircleImage from '../../shared/CircleImage';
import _Img from 'react-image';
import Add from '@material-ui/icons/Add';
import { urls } from '../../../utils';
import styled from 'styled-components';
import getImageSrc from '../../../utils/getImageSrc';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

const StyledHeaderCell = styled(TableCell)`
  background-color: #6fa2ff;
  color: white;
  font-size: 1.1rem;
`;

const TableWrap = styled.div`
  padding: 0rem 1.25rem;
  @media (max-width: 769px) {
    overflow-x: scroll;
    padding: 0;
  }
`;

const Img = styled(_Img)`
  margin-right: 10;
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  vertical-align: middle;
  border-radius: 50%;
`;

const Container = styled.div`
  text-align: right;
  margin-right: 1.25rem;
  @media (max-width: 600px) {
    text-align: left;
    margin-left: 1rem;
    margin-right: 0;
  }
`;

class MySkills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsData: [],
      loading: true,
      page: 0,
      rowsPerPage: 5,
    };
  }
  componentDidMount() {
    this.loadSkills();
  }

  loadSkills = async () => {
    const { actions } = this.props;
    let dataObj = {
      filterName: 'ascending',
      filterType: 'lexicographical',
    };
    try {
      await actions.getUserSkills(dataObj);
      this.setState({
        loading: false,
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

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  render() {
    const { userSkills } = this.props;
    const { loading, page, rowsPerPage } = this.state;
    return (
      <div>
        <Container>
          <Link to="/skillWizard">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleMenuClick}
              style={{ marginBottom: '10px' }}
            >
              <Add /> Create Skill
            </Button>
          </Link>
        </Container>

        {loading ? (
          <CircularLoader height={5} />
        ) : (
          <TableWrap>
            {userSkills.length !== 0 && (
              <Table>
                <colgroup>
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '25%' }} />
                  <col style={{ width: '25%' }} />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <StyledHeaderCell>Image</StyledHeaderCell>
                    <StyledHeaderCell>Name</StyledHeaderCell>
                    <StyledHeaderCell>Type</StyledHeaderCell>
                    <StyledHeaderCell>Status</StyledHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userSkills
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((skill, index) => {
                      const {
                        group,
                        skillTag,
                        language,
                        image,
                        skillName,
                        type,
                      } = skill;
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Link
                              to={{
                                pathname: `/${group}/${skillTag
                                  .toLowerCase()
                                  .replace(/ /g, '_')}/${language}`,
                              }}
                            >
                              <Img
                                // eslint-disable-next-line
                                src={getImageSrc({
                                  relativePath: `model=general&language=${language}&group=${group.replace(
                                    / /g,
                                    '%20',
                                  )}&image=/${image}`,
                                })}
                                unloader={
                                  <CircleImage name={skillName} size="40" />
                                }
                              />
                            </Link>
                          </TableCell>
                          <TableCell style={{ fontSize: '1rem' }}>
                            {skillName ? (
                              <Link
                                to={{
                                  pathname: `/${group}/${skillTag
                                    .toLowerCase()
                                    .replace(/ /g, '_')}/${language}`,
                                }}
                              >
                                {skillName}
                              </Link>
                            ) : (
                              'NA'
                            )}
                          </TableCell>
                          <TableCell style={{ fontSize: '1rem' }}>
                            {type}
                          </TableCell>
                          <TableCell style={{ width: '10rem' }}>
                            <FormControl>
                              <Select value={1} style={{ width: '10rem' }}>
                                <MenuItem value={1}>Enable</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10]}
                      count={userSkills.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ></TablePagination>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </TableWrap>
        )}
        {userSkills.length === 0 && !loading && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <h2>
              Create your first skill or learn more about{' '}
              <a
                href={`${urls.GITHUB_URL}/blob/master/docs/Skill_Tutorial.md`}
                rel="noopener noreferrer"
                target="_blank"
              >
                SUSI Skills
              </a>
            </h2>
          </div>
        )}
      </div>
    );
  }
}

MySkills.propTypes = {
  userSkills: PropTypes.array,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...appActions, ...uiActions }, dispatch),
  };
}

function mapStateToProps({ app }) {
  const { userSkills } = app;
  return {
    userSkills,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MySkills);

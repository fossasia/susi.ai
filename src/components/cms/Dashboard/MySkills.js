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
import Button from '@material-ui/core/Button';
import CircularLoader from '../../shared/CircularLoader';
import FormControl from '@material-ui/core/FormControl';
import Select from '../../shared/Select';
import CircleImage from '../../shared/CircleImage';
import _Img from 'react-image';
import Add from '@material-ui/icons/Add';
import { urls } from '../../../utils';
import styled from 'styled-components';
import getImageSrc from '../../../utils/getImageSrc';

const StyledTableCell = styled(TableCell)`
  padding: 0.625rem 1.5rem;
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

  render() {
    const { userSkills } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <Container>
          <Link to="/skillWizard">
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleMenuClick}
            >
              <Add /> Create Skill
            </Button>
          </Link>
        </Container>

        {loading ? (
          <CircularLoader height={5} />
        ) : (
          <TableWrap>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSkills.map((skill, index) => {
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
                      <StyledTableCell>
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
                      </StyledTableCell>
                      <StyledTableCell style={{ fontSize: '1rem' }}>
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
                      </StyledTableCell>
                      <StyledTableCell style={{ fontSize: '1rem' }}>
                        {type}
                      </StyledTableCell>
                      <StyledTableCell style={{ width: '10rem' }}>
                        <FormControl>
                          <Select value={1} style={{ width: '10rem' }}>
                            <MenuItem value={1}>Enable</MenuItem>
                          </Select>
                        </FormControl>
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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

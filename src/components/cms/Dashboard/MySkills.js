/* eslint-disable max-len */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import appActions from '../../../redux/actions/app';
import uiActions from '../../../redux/actions/ui';
import PropTypes from 'prop-types';
import Link from '../../shared/Link';
import MenuItem from '@material-ui/core/MenuItem';
import _Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '../../shared/Select';
import CircleImage from '../../shared/CircleImage';
import _Img from 'react-image';
import Add from '@material-ui/icons/Add';
import { urls } from '../../../utils';
import styled from 'styled-components';
import getImageSrc from '../../../utils/getImageSrc';
import MaterialTable from 'material-table';
import TableSleleton from '../../shared/TableLoader';

const TableWrap = styled.div`
  padding: 0rem 0.5rem;
  @media (max-width: 769px) {
    overflow-x: scroll;
    padding: 0;
  }
`;

const Button = styled(_Button)`
  width: 10rem;
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
const isSmallScreen = window.screen.availWidth < 500;
class MySkills extends Component {
  state = {
    skillsData: [],
    loading: true,
  };

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
          <TableSleleton />
        ) : (
          <TableWrap>
            {userSkills && Array.isArray(userSkills) && userSkills.length > 0 && (
              <MaterialTable
                title="My Skills"
                columns={[
                  {
                    title: 'Image',
                    field: 'imageLink',
                    render: rowData => {
                      return (
                        <Link
                          to={{
                            pathname: `/${
                              rowData.group
                            }/${rowData.skillTag
                              .toLowerCase()
                              .replace(/ /g, '_')}/${rowData.language}`,
                          }}
                        >
                          <Img
                            // eslint-disable-next-line
                            src={getImageSrc({
                              relativePath: `model=general&language=${
                                rowData.language
                              }&group=${rowData.group.replace(
                                / /g,
                                '%20',
                              )}&image=/${rowData.image}`,
                            })}
                            unloader={
                              <CircleImage name={rowData.skillName} size="40" />
                            }
                          />
                        </Link>
                      );
                    },
                  },
                  {
                    title: 'Name',
                    field: 'name',
                    render: rowData => {
                      return (
                        <Link
                          to={{
                            pathname: `/${
                              rowData.group
                            }/${rowData.skillTag
                              .toLowerCase()
                              .replace(/ /g, '_')}/${rowData.language}`,
                          }}
                        >
                          {rowData.skillName}
                        </Link>
                      );
                    },
                  },
                  { title: 'Type', field: 'type' },
                  {
                    title: 'Status',
                    field: 'status',
                    render: rowData => {
                      return (
                        <FormControl>
                          <Select value={1} style={{ width: '10rem' }}>
                            <MenuItem value={1}>Enable</MenuItem>
                          </Select>
                        </FormControl>
                      );
                    },
                  },
                ]}
                data={
                  userSkills &&
                  Array.isArray(userSkills) &&
                  userSkills.length > 0 &&
                  userSkills.map((skill, index) => {
                    return {
                      group: skill.group,
                      skillTag: skill.skillTag,
                      language: skill.language,
                      image: skill.image,
                      skillName: skill.skillName,
                      type: skill.type,
                    };
                  })
                }
                options={{
                  search: false,
                  toolbar: false,
                  showFirstLastPageButtons: !isSmallScreen,
                  headerStyle: {
                    backgroundColor: '#6fa2ff',
                    color: '#FFF',
                    fontSize: '1.2rem',
                  },
                }}
                style={{ margin: '10px' }}
              />
            )}
          </TableWrap>
        )}
        {userSkills.length === 0 && !loading && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <h2 style={{ padding: '5px' }}>
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

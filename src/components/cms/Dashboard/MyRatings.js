import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import CircularLoader from '../../shared/CircularLoader';
import { fetchUserRatings } from '../../../apis';
import { parseDate } from '../../../utils';
import styled from 'styled-components';
import Ratings from 'react-ratings-declarative';
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

class MyRatings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingsData: [],
      loading: true,
      showMySkills: true,
      page: 0,
      rowsPerPage: 5,
    };
  }
  componentDidMount() {
    this.loadSkills();
  }

  loadSkills = async () => {
    const { actions } = this.props;
    let ratingsData = [];
    try {
      let payload = await fetchUserRatings();
      if (payload.ratedSkills) {
        for (let i of payload.ratedSkills) {
          let skillName = Object.keys(i)[0];
          ratingsData.push({
            skillName: skillName,
            group: i[skillName].group,
            language: i[skillName].language,
            skillStar: i[skillName].stars,
            ratingTimestamp: i[skillName].timestamp,
          });
        }
        this.setState({
          ratingsData,
        });
      }
      this.setState({
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      actions.openSnackBar({
        snackBarMessage: "Error. Couldn't rating data.",
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
    let { ratingsData, loading, page, rowsPerPage } = this.state;
    return (
      <div>
        {loading ? (
          <CircularLoader height={5} />
        ) : (
          <TableWrap>
            <Table>
              <colgroup>
                <col style={{ width: '33%' }} />
                <col style={{ width: '33%' }} />
                <col style={{ width: '33%' }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <StyledHeaderCell>Skill Name</StyledHeaderCell>
                  <StyledHeaderCell>Rating</StyledHeaderCell>
                  <StyledHeaderCell>Timestamp</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratingsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((skill, index) => {
                    const {
                      group,
                      skillName,
                      ratingTimestamp,
                      skillStar,
                    } = skill;
                    return (
                      <TableRow key={index}>
                        <TableCell style={{ fontSize: '1rem' }}>
                          <Link
                            to={{
                              pathname: `/${group}/${skillName
                                .toLowerCase()
                                .replace(/ /g, '_')}/language`,
                            }}
                          >
                            {(
                              skillName.charAt(0).toUpperCase() +
                              skillName.slice(1)
                            ).replace(/[_-]/g, ' ')}
                          </Link>
                        </TableCell>
                        <TableCell style={{ fontSize: '1rem' }}>
                          <Ratings
                            rating={skillStar}
                            widgetRatedColors="#ffbb28"
                            widgetDimensions="20px"
                            widgetSpacings="0px"
                          >
                            <Ratings.Widget />
                            <Ratings.Widget />
                            <Ratings.Widget />
                            <Ratings.Widget />
                            <Ratings.Widget />
                          </Ratings>
                        </TableCell>
                        <TableCell>{parseDate(ratingTimestamp)}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    count={ratingsData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ></TablePagination>
                </TableRow>
              </TableFooter>
            </Table>
          </TableWrap>
        )}
        {ratingsData.length === 0 && !loading && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <h2>
              You have not rated any skill, go to{' '}
              <Link to="/">SUSI Skills Explorer</Link> and rate.
            </h2>
          </div>
        )}
      </div>
    );
  }
}

MyRatings.propTypes = {
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
)(MyRatings);

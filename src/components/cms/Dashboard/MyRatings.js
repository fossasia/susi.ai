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
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchUserRatings } from '../../../apis';
import { parseDate } from '../../../utils';
import styled from 'styled-components';

const StyledTableCell = styled(TableCell)`
  padding: 0.625rem 1.5rem;
`;

const TableWrap = styled.div`
  padding: 0rem 1.25rem;
`;

class MyRatings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingsData: [],
      loading: true,
      showMySkills: true,
    };
  }
  componentDidMount() {
    this.loadSkills();
  }

  loadSkills = () => {
    const { actions } = this.props;
    let ratingsData = [];
    fetchUserRatings()
      .then(payload => {
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
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        actions.openSnackBar({
          snackBarMessage: "Error. Couldn't rating data.",
          snackBarDuration: 2000,
        });
      });
  };

  render() {
    let { ratingsData, loading } = this.state;
    return (
      <div>
        {loading ? (
          <div className="center">
            <CircularProgress size={62} color="primary" />
            <h4>Loading</h4>
          </div>
        ) : (
          <TableWrap className="table-wrap">
            <Table className="table-root">
              <TableHead>
                <TableRow>
                  <TableCell>Skill Name</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratingsData.map((skill, index) => {
                  return (
                    <TableRow key={index}>
                      <StyledTableCell style={{ fontSize: '1rem' }}>
                        <Link
                          to={{
                            pathname:
                              '/skills/' +
                              skill.group +
                              '/' +
                              skill.skillName.toLowerCase().replace(/ /g, '_') +
                              '/' +
                              skill.language,
                          }}
                        >
                          {(
                            skill.skillName.charAt(0).toUpperCase() +
                            skill.skillName.slice(1)
                          ).replace(/[_-]/g, ' ')}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell style={{ fontSize: '1rem' }}>
                        {skill.skillStar}
                      </StyledTableCell>
                      <StyledTableCell>
                        {parseDate(skill.ratingTimestamp)}
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableWrap>
        )}
        {ratingsData.length === 0 && !loading && (
          <div>
            <div className="center">
              <br />
              <h2>
                You have not rated any skill, go to{' '}
                <Link to="/skills">SUSI Skills Explorer</Link> and rate.
              </h2>
              <br />
            </div>
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

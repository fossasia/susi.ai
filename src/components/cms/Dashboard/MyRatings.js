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
import styled, { ThemeProvider } from 'styled-components';
import theme from 'styled-theming';

const cellHeaderColor = theme('mode', {
  light: 'black',
  dark: 'white',
});

const cellContentColor = theme('mode', {
  light: 'black',
  dark: '#70869c',
});

const StyledTableCell = styled(TableCell)`
  padding: 0.625rem 1.5rem;
  color: ${cellContentColor};
`;

const StyledHeaderTableCell = styled(TableCell)`
  font-size: 1rem;
  color: ${cellHeaderColor};
  font-weight: bold;
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

  render() {
    let { ratingsData, loading } = this.state;
    const { theme } = this.props;
    return (
      <ThemeProvider
        theme={theme === 'dark' ? { mode: 'dark' } : { mode: 'light' }}
      >
        <div>
          {loading ? (
            <CircularLoader height={5} />
          ) : (
            <TableWrap>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledHeaderTableCell>Skill Name</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Rating</StyledHeaderTableCell>
                    <StyledHeaderTableCell>Timestamp</StyledHeaderTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ratingsData.map((skill, index) => {
                    const {
                      group,
                      skillName,
                      ratingTimestamp,
                      skillStar,
                    } = skill;
                    return (
                      <TableRow key={index}>
                        <StyledTableCell style={{ fontSize: '1rem' }}>
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
                        </StyledTableCell>
                        <StyledTableCell style={{ fontSize: '1rem' }}>
                          {skillStar}
                        </StyledTableCell>
                        <StyledTableCell>
                          {parseDate(ratingTimestamp)}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
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
      </ThemeProvider>
    );
  }
}

MyRatings.propTypes = {
  actions: PropTypes.object,
  theme: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch),
  };
}

function mapStateToProps(store) {
  const { theme } = store.settings;
  return {
    theme,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyRatings);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uiActions from '../../../redux/actions/ui';
import { fetchUserRatings } from '../../../apis';
import { parseDate } from '../../../utils';
import { getSkillFromRating } from '../../../utils/getSkillFromRating';
import styled from 'styled-components';
import Ratings from 'react-ratings-declarative';
import MaterialTable from 'material-table';
import TableSleleton from '../../shared/TableLoader';

const TableWrap = styled.div`
  padding: 0rem 1.25rem;
  @media (max-width: 769px) {
    overflow-x: scroll;
    padding: 0;
  }
`;

class MyRatings extends Component {
  state = {
    ratingsData: [],
    loading: true,
    showMySkills: true,
  };

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

          let skill = {
            skillName: skillName,
            group: i[skillName].group,
            language: i[skillName].language,
            skillStar: i[skillName].stars,
            ratingTimestamp: i[skillName].timestamp,
          };
          ratingsData.push(skill);
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
    return (
      <div>
        {loading ? (
          <TableSleleton />
        ) : (
          <TableWrap>
            {ratingsData &&
              Array.isArray(ratingsData) &&
              ratingsData.length > 0 && (
                <MaterialTable
                  title="My Rating"
                  columns={[
                    {
                      title: 'Skill Name',
                      field: 'skillName',
                      render: rowData => {
                        return (
                          <Link
                            to={{
                              pathname: `/${rowData.group}/${getSkillFromRating(
                                rowData.skillName,
                              )}/${rowData.language}`,
                            }}
                          >
                            {(
                              rowData.skillName.charAt(0).toUpperCase() +
                              rowData.skillName.slice(1)
                            ).replace(/[_-]/g, ' ')}
                          </Link>
                        );
                      },
                    },
                    {
                      title: 'Rating',
                      field: 'rating',
                      render: rowData => {
                        return (
                          <Ratings
                            rating={rowData.skillStar}
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
                        );
                      },
                    },
                    {
                      title: 'Timestamp',
                      field: 'timestamp',
                      render: rowData => {
                        return parseDate(rowData.ratingTimestamp);
                      },
                    },
                  ]}
                  data={
                    ratingsData &&
                    Array.isArray(ratingsData) &&
                    ratingsData.length > 0 &&
                    ratingsData.map((rating, index) => {
                      return {
                        group: rating.group,
                        skillName: rating.skillName,
                        ratingTimestamp: rating.ratingTimestamp,
                        skillStar: rating.skillStar,
                        language: rating.language,
                      };
                    })
                  }
                  options={{
                    search: false,
                    toolbar: false,
                    headerStyle: {
                      backgroundColor: '#6fa2ff',
                      color: '#FFF',
                      fontSize: '1.2rem',
                    },
                  }}
                />
              )}
          </TableWrap>
        )}
        {ratingsData.length === 0 && !loading && (
          <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
            <h2 style={{ padding: '5px' }}>
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

// Packages
import React from 'react';
import PropTypes from 'prop-types';
import { GeoChart } from 'react-chartkick';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import styled from 'styled-components';
import { isoCountries } from '../../../utils';
import { DefaultMessage } from '../../shared/Typography';

const ListContainer = styled.div`
  width: 25%;
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  @media (max-width: 800px) {
    width: 100%;
    margin: 0 auto;
  }
`;

const GraphContainer = styled.div`
  width: 70%;
  @media (max-width: 800px) {
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 800px) {
    display: block;
  }
`;

const getCountryName = countryCode => {
  if (isoCountries.hasOwnProperty(countryCode)) {
    return isoCountries[countryCode];
  }
};

const CountryWiseSkillUsageCard = ({ countryWiseSkillUsage }) => {
  const countryUsageList = () => {
    return (
      <Table>
        <TableBody>
          {countryWiseSkillUsage &&
            countryWiseSkillUsage.map((data, id) => {
              const countryCode = data[0];
              const usage = data[1];
              const countryName = getCountryName(countryCode);
              return (
                <TableRow key={id}>
                  <TableCell style={{ width: '70%', padding: '0' }}>
                    {countryName}:
                  </TableCell>
                  <TableCell>{usage}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div>
      {countryWiseSkillUsage && countryWiseSkillUsage.length ? (
        <Container>
          <GraphContainer>
            <GeoChart data={countryWiseSkillUsage} />
          </GraphContainer>
          <ListContainer>{countryUsageList()}</ListContainer>
        </Container>
      ) : (
        <DefaultMessage>
          Country wise usage distribution is not available.
        </DefaultMessage>
      )}
    </div>
  );
};

CountryWiseSkillUsageCard.propTypes = {
  countryWiseSkillUsage: PropTypes.array,
};

export default CountryWiseSkillUsageCard;

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import uiActions from '../../redux/actions/ui';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 3rem 0 -2.5rem 0;
  background: #4caf50;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  height: 40px;
`;

const ConfigureSpan = styled.span`
  text-decoration: underline;
  margin-left: 4px;
  cursor: pointer;
`;

const AppBanner = ({ actions }) => {
  const openControlPage = () => {
    actions.openModal({
      modalType: 'deviceControlSettings',
    });
  };
  return (
    <Container>
      You are currently accessing the local version of your SUSI.AI running on
      your smart device.
      <ConfigureSpan onClick={openControlPage}>Configure now</ConfigureSpan>
    </Container>
  );
};

AppBanner.propTypes = {
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
)(AppBanner);

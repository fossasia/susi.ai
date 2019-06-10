import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import appActions from '../../redux/actions/app';

const Container = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0px;
  left: 0px;
  background: rgba(1, 16, 38, 0.88);
  color: white;
  padding: 2rem;
  z-index: 10;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const CookiePolicy = ({ actions }) => {
  return (
    <Container>
      Our website uses cookies to deliver the best possible user experience, to
      help our site work, to understand how it is used. By clicking
      &quot;Accept&quot; you agree to us doing so. To know more about our
      policies click on &quot;More Info&quot; button
      <ButtonContainer>
        <Button variant="contained" onClick={actions.hideCookiePolicy}>
          <Link style={{ color: 'black' }} to="/privacy">
            More Info
          </Link>
        </Button>
        <Button
          onClick={actions.hideCookiePolicy}
          style={{ marginLeft: '1rem' }}
          variant="contained"
        >
          Accept
        </Button>
      </ButtonContainer>
    </Container>
  );
};

CookiePolicy.propTypes = {
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(CookiePolicy);

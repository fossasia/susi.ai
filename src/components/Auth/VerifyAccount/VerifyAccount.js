import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';
import { verifyEmail } from '../../../apis/index';

const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', sans-serif;
  font-size: 24px;
  font-weight: 300px;
`;

const urlPropsQueryConfig = {
  accessToken: { type: UrlQueryParamTypes.string, queryParam: 'access_token' },
  requestSession: {
    type: UrlQueryParamTypes.boolean,
    queryParam: 'request_session',
  },
  validateEmail: {
    type: UrlQueryParamTypes.string,
    queryParam: 'validateEmail',
  },
};

class VerifyAccount extends Component {
  static propTypes = {
    accessToken: PropTypes.string,
    validateEmail: PropTypes.string,
    requestSession: PropTypes.bool,
  };

  static defaultProps = {
    accessToken: null,
    validateEmail: null,
    requestSession: false,
  };

  state = {
    loading: true,
    message: null,
  };

  componentDidMount() {
    const { accessToken, validateEmail, requestSession } = this.props;
    if (accessToken && validateEmail) {
      verifyEmail({ accessToken, validateEmail, requestSession })
        .then(payload => {
          const { accepted } = payload;
          if (accepted) {
            this.setState({
              loading: false,
              message:
                'Thank you! Your account is now verified. Please login to continue.',
            });
          } else {
            this.setState({
              loading: false,
              message: 'Bad access token or email id!',
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({
            loading: false,
            message: 'An error occurred. Please try again.',
          });
        });
    } else {
      this.setState({
        loading: false,
        message: 'Bad access token or email id!',
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.loading && (
          <Container>
            <CircularProgress size={64} />
          </Container>
        )}
        {this.state.message && <Container>{this.state.message}</Container>}
      </div>
    );
  }
}

export default addUrlProps({ urlPropsQueryConfig })(VerifyAccount);

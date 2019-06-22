import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import urls from '../../../utils/urls';
import Alert from '../../shared/Alert';
import styled from 'styled-components';
import CircularLoader from '../../shared/CircularLoader';

const Select = styled(_Select)`
  width: 11.25rem;
  margin: 1.5rem 0;
  @media (min-width: 500px) {
    float: right;
  }
`;

const HomeDiv = styled.div`
  &&& {
    @media (max-width: 500px) {
      padding: 0rem;
    }
  }
`;

const Container = styled.div`
  @media (max-width: 500px) {
    height: 60vh;
    width: 100%;
    overflow: scroll;
  }
`;

const menuObj = [
  { value: 10, text: 'Last 10 logs' },
  { value: 20, text: 'Last 20 logs' },
  { value: 50, text: 'Last 50 logs' },
  { value: 100, text: 'Last 100 logs' },
  { value: 200, text: 'Last 200 logs' },
  { value: 500, text: 'Last 500 logs' },
  { value: 1000, text: 'Last 1000 logs' },
];

class SystemLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: '',
      error: false,
      loading: true,
      currentCount: '1000',
    };
  }

  componentDidMount() {
    this.loadSystemLogs(1000);
  }

  loadSystemLogs = count => {
    const { accessToken } = this.props;
    axios
      .get(
        `${urls.API_URL}/log.txt?access_token=${accessToken}&count=${count}`,
        {
          responseType: 'arraybuffer',
        },
      )
      .then(response => {
        let { data } = response;
        // eslint-disable-next-line
        var buffer = new Buffer(data, 'binary');
        var textdata = buffer.toString(); // for string
        let error = false;
        if (textdata.indexOf('WARN root') !== -1) {
          error = true;
        }
        this.setState({
          error: error,
          logs: textdata,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleCountChange = event => {
    const { value } = event.target;
    this.setState({
      currentCount: value,
      loading: true,
    });
    this.loadSystemLogs(value);
  };

  render() {
    const { loading } = this.state;
    let renderMenu = menuObj.map(menu => (
      <MenuItem key={menu.value} value={menu.value}>
        {menu.text}
      </MenuItem>
    ));
    return (
      <HomeDiv className="tabs">
        <Select
          onChange={this.handleCountChange}
          value={this.state.currentCount}
        >
          {renderMenu}
        </Select>
        {loading ? (
          <CircularLoader height={35} />
        ) : (
          <Container>
            <Alert
              description={this.state.logs}
              type={this.state.error === true ? 'error' : 'success'}
            />
          </Container>
        )}
      </HomeDiv>
    );
  }
}

SystemLogs.propTypes = {
  history: PropTypes.object,
  accessToken: PropTypes.string,
};

function mapStateToProps(store) {
  return {
    accessToken: store.app.accessToken,
  };
}

export default connect(
  mapStateToProps,
  null,
)(SystemLogs);

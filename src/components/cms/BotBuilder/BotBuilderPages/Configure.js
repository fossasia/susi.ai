import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconButton from '@material-ui/core/IconButton';
import Code from '@material-ui/icons/Code';
import Table from '@material-ui/icons/Web';
import PropTypes from 'prop-types';
import CodeView from './ConfigureViews/CodeView';
import UIView from './ConfigureViews/UIView';
import createActions from '../../../../redux/actions/create';
import './Animation.min.css';
import styled from 'styled-components';

const Home = styled.div`
  margin-top: 10px;
`;

const Container = styled.div`
  display: flex;
`;

const H1 = styled.h1`
  line-height: 50px;
  text-align: center;

  @media (max-width: 480px) {
    line-height: 2.5rem;
  }
`;

const IconButtonContainer = styled.div`
  margin-left: auto;
  margin-right: 0px;
`;

const ViewContainer = styled.div`
  padding: 0px;
`;

class Configure extends Component {
  render() {
    const { actions, view } = this.props;
    return (
      <Home>
        <Container>
          <H1>3. Configure your bot</H1>
          <IconButtonContainer>
            <IconButton
              className="iconbutton"
              onClick={() => actions.setView({ view: 'code' })}
            >
              <Code color={view === 'code' ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton
              className="iconbutton"
              onClick={() => actions.setView({ view: 'ui' })}
            >
              <Table color={view === 'ui' ? 'primary' : 'inherit'} />
            </IconButton>
          </IconButtonContainer>
        </Container>
        <ViewContainer>
          {view === 'code' ? <CodeView /> : null}
          {view === 'ui' ? <UIView /> : null}
        </ViewContainer>
      </Home>
    );
  }
}

Configure.propTypes = {
  view: PropTypes.string,
  actions: PropTypes.object,
};

function mapStateToProps(store) {
  return {
    view: store.create.view,
  };
}

function mapDispatchToActions(dispatch) {
  return {
    actions: bindActionCreators(createActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(Configure);

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Code from '@material-ui/icons/Code';
import Table from '@material-ui/icons/Web';
import CodeView from './DesignViews/CodeView';
import UIView from './DesignViews/UIView';
import './Animation.min.css';
import createActions from '../../../../redux/actions/create';
import styled from 'styled-components';

const Home = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Container = styled.div`
  display: flex;
`;

const H1 = styled.h1`
  line-height: 50px;

  @media (max-width: 480px) {
    line-height: 2.5rem;
  }
`;

const IconButtonContainer = styled.div`
  margin-left: auto;
  margin-right: 0px;
`;

const ViewContainer = styled.div`
  padding: ${props => (props.view ? '30px 10px 0 10px' : '0px')};

  @media (max-width: 480px) {
    margin-bottom: 30px;
  }
`;

class Design extends React.Component {
  render() {
    const { actions, view } = this.props;
    return (
      <Home>
        <Container>
          <H1>2. Choose Color and Background</H1>
          <IconButtonContainer>
            <IconButton
              className="iconbutton"
              onClick={() => {
                actions.setView({ view: 'code' });
              }}
            >
              <Code color={view === 'code' ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton
              className="iconbutton"
              onClick={() => {
                actions.setView({ view: 'ui' });
              }}
            >
              <Table color={view === 'ui' ? 'primary' : 'inherit'} />
            </IconButton>
          </IconButtonContainer>
        </Container>
        <ViewContainer>
          {view === 'code' && <CodeView />}
          {view === 'ui' && <UIView />}
        </ViewContainer>
      </Home>
    );
  }
}

Design.propTypes = {
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
)(Design);

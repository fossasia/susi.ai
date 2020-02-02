import React from 'react';
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
import {
  Heading,
  Container,
  EditorContainer,
  HeadingContainer,
  IconButtonContainer,
} from '../styles';

const Configure = ({ actions, view }) => {
  return (
    <div>
      <HeadingContainer>
        <Heading>3. Configure your bot</Heading>
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
      </HeadingContainer>
      {view === 'code' ? (
        <EditorContainer>
          <CodeView />
        </EditorContainer>
      ) : null}
      {view === 'ui' ? (
        <Container>
          <UIView />
        </Container>
      ) : null}
    </div>
  );
};

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

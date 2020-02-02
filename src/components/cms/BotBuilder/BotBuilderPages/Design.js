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
import {
  Heading,
  Container,
  EditorContainer,
  HeadingContainer,
  IconButtonContainer,
} from '../styles';

const Design = ({ actions, view }) => {
  return (
    <div>
      <HeadingContainer>
        <Heading>2. Choose Color and Background</Heading>
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
      </HeadingContainer>
      {view === 'code' && (
        <EditorContainer>
          <CodeView />
        </EditorContainer>
      )}
      {view === 'ui' && (
        <Container>
          <UIView />
        </Container>
      )}
    </div>
  );
};

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

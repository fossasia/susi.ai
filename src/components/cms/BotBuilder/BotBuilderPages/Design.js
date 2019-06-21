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

class Design extends React.Component {
  render() {
    const { actions, view } = this.props;
    return (
      <div className="center menu-page">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h1 style={{ lineHeight: '50px' }}>2. Choose Color and Background</h1>
          <div style={{ marginLeft: 'auto', marginRight: '0px' }}>
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
          </div>
        </div>
        <div
          style={{
            padding: view === 'code' ? '30px 10px 0 10px' : '0px 10px 0 10px',
          }}
        >
          {view === 'code' && <CodeView />}
          {view === 'ui' && <UIView />}
        </div>
      </div>
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

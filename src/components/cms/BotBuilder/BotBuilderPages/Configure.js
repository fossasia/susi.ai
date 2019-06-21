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
class Configure extends Component {
  render() {
    const { actions, view } = this.props;
    return (
      <div className="menu-page">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <h1 style={{ lineHeight: '50px' }}>3. Configure your bot</h1>
          <div style={{ marginLeft: 'auto', marginRight: '0px' }}>
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
          </div>
        </div>
        <div style={{ padding: '30px 10px 0 10px' }}>
          {view === 'code' ? <CodeView /> : null}
          {view === 'ui' ? <UIView /> : null}
        </div>
      </div>
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

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../redux/actions/skill';
import uiActions from '../../redux/actions/ui';
import mobileView from '../../utils/isMobileView';

const isMobileView = mobileView();

const ExampleComment = styled.div`
  cursor: pointer;
  font-style: italic;
  font-size: 14px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eaeded;
  background-color: #f4f6f6;
  margin: ${props => props.margin};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 170px;
  position: relative;
  white-space: initial;

  :before {
    content: ' ';
    position: absolute;
    bottom: -14px;
    right: 10%;
    border-width: 0 0 13px 26px;
    border-style: solid;
    display: block;
    border-color: transparent #eaeded;
    width: 0;
  }

  :after {
    content: ' ';
    position: absolute;
    bottom: -12px;
    right: 10%;
    border-width: 0 0 12px 25px;
    border-style: solid;
    border-color: #f4f6f6 transparent transparent #f4f6f6;
  }
  @media (max-width: 550px) {
    padding: 4px;
  }
`;

const SkillExampleBubble = ({
  data,
  history,
  actions,
  margin = '1.5% 4.85% 1.5% 0',
}) => {
  return (
    <ExampleComment
      margin={margin}
      onClick={event => {
        history.push({
          search: `?testExample=${data}`,
        });
        actions.handleTestSkillExample();
        isMobileView &&
          actions.openModal({
            modalType: 'chatBubble',
            fullScreenChat: true,
          });
        actions.handleChatBubble({
          chatBubble: isMobileView ? 'minimised' : 'full',
        });
      }}
    >
      <q>{data}</q>
    </ExampleComment>
  );
};

SkillExampleBubble.propTypes = {
  data: PropTypes.string,
  history: PropTypes.object,
  actions: PropTypes.object,
  margin: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...skillActions, ...uiActions }, dispatch),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(SkillExampleBubble);

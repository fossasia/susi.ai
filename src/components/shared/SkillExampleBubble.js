import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import skillActions from '../../redux/actions/skill';
import uiActions from '../../redux/actions/ui';
import messagesActions from '../../redux/actions/messages';
import generateMessage from '../../utils/generateMessage';

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
  actions,
  margin = '1.5% 4.85% 1.5% 0',
  speechOutputAlways,
  mode,
}) => {
  return (
    <ExampleComment
      margin={margin}
      onClick={event => {
        generateMessage({
          text: data,
          voice: speechOutputAlways,
          createMessage: actions.createMessage,
          createSusiMessage: actions.createSusiMessage,
          mode,
          setPendingUserMessage: actions.setPendingUserMessage,
          setChatMode: actions.setChatMode,
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
  speechOutputAlways: PropTypes.bool,
  mode: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { ...skillActions, ...uiActions, ...messagesActions },
      dispatch,
    ),
  };
}

function mapStateToProps(store) {
  return {
    speechOutputAlways: store.settings.speechOutputAlways,
    mode: store.ui.mode,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillExampleBubble);

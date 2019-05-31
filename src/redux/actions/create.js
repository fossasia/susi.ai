import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

const createActions = {
  setView: createAction(actionTypes.CREATE_SET_VIEW),
  setSkillData: createAction(
    actionTypes.CREATE_SET_SKILL_DATA,
    returnArgumentsFn,
  ),
  setDesignData: createAction(
    actionTypes.CREATE_SET_DESIGN_DATA,
    returnArgumentsFn,
  ),
  updateDesignData: createAction(actionTypes.CREATE_UPDATE_DESIGN_DATA),
  resetDesignData: createAction(
    actionTypes.CREATE_RESET_DESIGN_DATA,
    returnArgumentsFn,
  ),
  setDesignComponentColor: createAction(
    actionTypes.CREATE_SET_DESIGN_COMPONENT_COLOR,
    returnArgumentsFn,
  ),
  setConfigureData: createAction(
    actionTypes.CREATE_SET_CONFIGURE_DATA,
    returnArgumentsFn,
  ),
  getSkillByCommitId: createAction(
    actionTypes.CREATE_GET_SKILL_BY_COMMIT_ID,
    apis.fetchSkillByCommitId,
  ),
  getSkillCode: createAction(
    actionTypes.CREATE_GET_SKILL_CODE,
    apis.fetchSkillCode,
  ),
  setSkillCode: createAction(
    actionTypes.CREATE_SET_SKILL_CODE,
    returnArgumentsFn,
  ),
  getBotBuilderCode: createAction(
    actionTypes.CREATE_GET_BOTBUILDER_CODE,
    apis.fetchSkillCode,
  ),
  getAuthorUrl: createAction(
    actionTypes.CREATE_GET_AUTHOR_URL,
    apis.fetchAuthorUrl,
  ),
  getDraftBotDetails: createAction(
    actionTypes.CREATE_GET_DRAFT_BOT_DETAILS,
    apis.readDraft,
  ),
  getBotDetails: createAction(
    actionTypes.CREATE_GET_BOT_DETAILS,
    apis.fetchBotDetails,
  ),
  setBotAvatar: createAction(
    actionTypes.CREATE_SET_BOT_AVATAR,
    apis.uploadBotImage,
  ),
  setBotBackgroundImage: createAction(
    actionTypes.CREATE_SET_BOT_BACKGROUND_IMAGE,
    apis.uploadBotImage,
  ),
  resetCreateStore: createAction(actionTypes.CREATE_RESET_STORE),
};

export default createActions;

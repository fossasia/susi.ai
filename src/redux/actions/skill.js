import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

const skillActions = {
  getSkillMetaData: createAction(
    actionTypes.SKILL_GET_METADATA,
    apis.fetchSkillMetaData,
  ),
  getSkillRating: createAction(
    actionTypes.SKILL_GET_SKILL_RATING,
    apis.changeRating,
  ),
  getUserRating: createAction(
    actionTypes.SKILL_GET_USER_RATING,
    apis.fetchUserSkillRating,
  ),
  setUserRating: createAction(
    actionTypes.SKILL_SET_USER_RATING,
    returnArgumentsFn,
  ),
  getDateWiseSkillUsage: createAction(
    actionTypes.SKILL_GET_DATEWISE_SKILL_USAGE,
    apis.fetchDateWiseSkillUsage,
  ),
  getCountryWiseSkillUsage: createAction(
    actionTypes.SKILL_GET_COUNTRYWISE_SKILL_USAGE,
    apis.fetchCountryWiseSkillUsage,
  ),
  getDeviceWiseSkillUsage: createAction(
    actionTypes.SKILL_GET_DEVICEWISE_SKILL_USAGE,
    apis.fetchDeviceWiseSkillUsage,
  ),
  getRatingsOverTime: createAction(
    actionTypes.SKILL_GET_RATINGS_OVER_TIME,
    apis.fetchRatingsOverTime,
  ),
  getSkillFeedbacks: createAction(
    actionTypes.SKILL_GET_SKILL_FEEDBACKS,
    apis.fetchSkillFeedbacks,
  ),
  setSkillFeedback: createAction(
    actionTypes.SKILL_SET_SKLL_FEEDBACK,
    apis.postSkillFeedback,
  ),
  deleteSkillFeedback: createAction(
    actionTypes.SKILL_DELETE_SKILL_FEEDBACK,
    apis.deleteSkillFeedback,
  ),
  getAuthorSkills: createAction(
    actionTypes.SKILL_GET_AUTHOR_SKILLS,
    apis.fetchSkillsByAuthor,
  ),
  deleteSkill: createAction(actionTypes.SKILL_DELETE_SKILL, apis.deleteSkill),
  setSkillLoading: createAction(actionTypes.SKILL_SET_SKILL_LOADING),
};

export default skillActions;

import { createAction } from 'redux-actions';
import actionTypes from '../actionTypes';
import * as apis from '../../apis';

const returnArgumentsFn = function(payload) {
  return Promise.resolve(payload);
};

const skillsActions = {
  initializeSkillData: createAction(
    actionTypes.SKILLS_INITIALIZE_SKILL_DATA,
    returnArgumentsFn,
  ),
  initializeSkillDataFailed: createAction(
    actionTypes.SKILLS_INITIALIZE_SKILL_DATA_FAILED,
    returnArgumentsFn,
  ),
  getMetricsSkills: createAction(
    actionTypes.SKILLS_GET_METRICS_SKILLS,
    apis.fetchMetricsSkills,
  ),
  getLanguageOptions: createAction(
    actionTypes.SKILLS_GET_LANGUAGE_OPTIONS,
    apis.fetchLanguageOptions,
  ),
  getGroupOptions: createAction(
    actionTypes.SKILLS_GET_GROUP_OPTIONS,
    apis.fetchGroupOptions,
  ),
  getSkills: createAction(actionTypes.SKILLS_GET_SKILL_LIST, apis.fetchSkills),
  setFilterType: createAction(
    actionTypes.SKILLS_SET_FILTER_TYPE,
    returnArgumentsFn,
  ),
  setLanguageFilter: createAction(
    actionTypes.SKILLS_SET_LANGUAGE_FILTER,
    returnArgumentsFn,
  ),
  setOrderByFilter: createAction(
    actionTypes.SKILLS_SET_ORDER_BY_FILTER,
    returnArgumentsFn,
  ),
  setCategoryFilter: createAction(
    actionTypes.SKILLS_SET_CATEGORY_FILTER,
    returnArgumentsFn,
  ),
  setSearchFilter: createAction(
    actionTypes.SKILLS_SET_SEARCH_FILTER,
    returnArgumentsFn,
  ),
  setReviewedFilter: createAction(
    actionTypes.SKILLS_SET_REVIEW_FILTER,
    returnArgumentsFn,
  ),
  setStaffpickFilter: createAction(
    actionTypes.SKILLS_SET_STAFFPICK_FILTER,
    returnArgumentsFn,
  ),
  setStarRatingFilter: createAction(
    actionTypes.SKILLS_SET_STAR_RATING_FILTER,
    returnArgumentsFn,
  ),
  setTimeFilter: createAction(
    actionTypes.SKILLS_SET_TIME_FILTER,
    returnArgumentsFn,
  ),
  setSkillsViewType: createAction(
    actionTypes.SKILLS_SET_VIEWTYPE,
    returnArgumentsFn,
  ),
  setSkillsPerPage: createAction(
    actionTypes.SKILLS_SET_SKILLS_PER_PAGE,
    returnArgumentsFn,
  ),
  setSkillsPageNumber: createAction(
    actionTypes.SKILLS_SET_PAGE_NUMBER,
    returnArgumentsFn,
  ),
  setSkillsLoading: createAction(
    actionTypes.SKILLS_SET_SKILLS_LOADING,
    returnArgumentsFn,
  ),
};

export default skillsActions;

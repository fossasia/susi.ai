import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';

let languageArray =
  localStorage.getItem('languages') !== null
    ? localStorage.getItem('languages').split(',')
    : [];

const defaultState = {
  viewType: 'list',
  loadingSkills: false,
  loadingSkillsError: false,
  metricSkills: {
    staffPicksSkills: [],
    topRatedSkills: [],
    topUsedSkills: [],
    latestUpdatedSkills: [],
    newestSkills: [],
    topFeedbackSkills: [],
    topGames: [],
    systemSkills: [],
  },
  // Skills
  skills: [],
  groups: [],
  languages: [],
  // Filter
  groupValue: 'All',
  languageValue:
    languageArray.length > 0 && languageArray[0] !== ''
      ? languageArray
      : ['en'],
  orderBy: 'ascending',
  filterType: '',
  searchQuery: '',
  searchType: ['skill_name', 'descriptions', 'examples', 'author'],
  ratingRefine: null,
  reviewed: true,
  staffPicks: false,
  // Pagination
  entriesPerPage: 10,
  listPage: 1,
  listOffset: 0,
  listSkills: [],
};

export default handleActions(
  {
    [actionTypes.SKILLS_INITIALIZE_SKILL_DATA](state, { payload }) {
      return {
        ...state,
        loadingSkillsError: false,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_INITIALIZE_SKILL_DATA_FAILED](state, { payload }) {
      return {
        ...state,
        loadingSkillsError: true,
        loadingSkills: false,
      };
    },
    [actionTypes.SKILLS_GET_METRICS_SKILLS](state, { payload }) {
      const { metrics } = payload;
      const metricSkills = {
        staffPicksSkills: metrics.staffPicks,
        topRatedSkills: metrics.rating,
        topUsedSkills: metrics.usage,
        latestUpdatedSkills: metrics.latest,
        newestSkills: metrics.newest,
        topFeedbackSkills: metrics.feedback,
        topGames: metrics.gamesTriviaAndAccessories,
        systemSkills: metrics.systemSkills,
      };
      return {
        ...state,
        metricSkills,
        loadingSkills: false,
      };
    },
    [actionTypes.SKILLS_GET_LANGUAGE_OPTIONS](state, { payload }) {
      const { languagesArray } = payload;
      let languages = [];
      languagesArray.sort();
      languagesArray.forEach(language => {
        if (language.length === 2 && language !== 'xx') {
          languages.push(language);
        }
      });
      return {
        ...state,
        languages,
      };
    },

    [actionTypes.SKILLS_GET_GROUP_OPTIONS](state, { payload }) {
      const { groups } = payload;
      groups.sort();
      groups.unshift('All');
      return {
        ...state,
        groups,
      };
    },
    [actionTypes.SKILLS_GET_SKILL_LIST](state, { payload }) {
      const { filteredData } = payload;
      return {
        ...state,
        skills: filteredData,
        loadingSkills: false,
        listOffset: 0,
        listPage: 1,
        entriesPerPage: 10,
        listSkills: filteredData.slice(0, 10),
      };
    },
    [actionTypes.SKILLS_SET_VIEWTYPE](state, { payload }) {
      const { viewType } = payload;
      return {
        ...state,
        viewType,
      };
    },
    [actionTypes.SKILLS_SET_SKILLS_PER_PAGE](state, { payload }) {
      const { entriesPerPage } = payload;
      let { listPage, skills } = state;
      let listOffset = entriesPerPage * (listPage - 1);
      if (listOffset > skills.length - 1) {
        listPage = Math.ceil(skills.length / entriesPerPage);
        listOffset = entriesPerPage * (listPage - 1);
      }
      return {
        ...state,
        entriesPerPage,
        listSkills: skills.slice(listOffset, listOffset + entriesPerPage),
        listPage,
        listOffset,
      };
    },
    [actionTypes.SKILLS_SET_PAGE_NUMBER](state, { payload }) {
      const { listPage } = payload;
      const { entriesPerPage, skills } = state;
      const listOffset = entriesPerPage * (listPage - 1);

      return {
        ...state,
        listPage,
        listSkills: skills.slice(listOffset, listOffset + entriesPerPage),
        listOffset,
      };
    },
    [actionTypes.SKILLS_SET_SKILLS_LOADING](state) {
      return {
        ...state,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_SKILLS_LOADED](state) {
      return {
        ...state,
        loadingSkills: false,
      };
    },
    // Filters
    [actionTypes.SKILLS_SET_FILTER_TYPE](state, { payload }) {
      const { filterType } = payload;
      return {
        ...state,
        filterType,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_LANGUAGE_FILTER](state, { payload }) {
      const { languageValue } = payload;
      return {
        ...state,
        languageValue,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_ORDER_BY_FILTER](state, { payload }) {
      const { orderBy } = payload;
      return {
        ...state,
        orderBy,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_CATEGORY_FILTER](state, { payload }) {
      const { groupValue } = payload;
      return {
        ...state,
        groupValue,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_SEARCH_FILTER](state, { payload }) {
      const {
        searchQuery = state.searchQuery,
        searchType = state.searchType,
      } = payload;
      const loadingSkills = searchQuery !== '';
      return {
        ...state,
        searchQuery,
        searchType,
        loadingSkills,
      };
    },
    [actionTypes.SKILLS_SET_REVIEW_FILTER](state, { payload }) {
      const { reviewed } = payload;
      return {
        ...state,
        reviewed,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_STAFFPICK_FILTER](state, { payload }) {
      const { staffPicks } = payload;
      return {
        ...state,
        staffPicks,
        loadingSkills: true,
      };
    },
    [actionTypes.SKILLS_SET_STAR_RATING_FILTER](state, { payload }) {
      const { ratingRefine } = payload;
      return {
        ...state,
        skills: state.skills.filter(
          skill =>
            skill.skillRating &&
            skill.skillRating.stars.avgStar >= ratingRefine,
        ),
        ratingRefine,
      };
    },
    [actionTypes.SKILLS_SET_TIME_FILTER](state, { payload }) {
      const { timeFilter, filterType } = payload;
      return {
        ...state,
        timeFilter,
        filterType,
        loadingSkills: true,
      };
    },
  },
  {
    ...defaultState,
  },
);

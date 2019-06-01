import { handleActions } from 'redux-actions';
import actionTypes from '../actionTypes';
import { urls } from '../../utils';
import avatars from '../../utils/avatars';
import _ from 'lodash';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const { API_URL } = urls;
let avatarsIcon = avatars.slice()[1].url;
let botIcon = avatars.slice()[0].url;
const CMS_API_PREFIX = 'cms';
const IMAGE_GET_URL = `${API_URL}/${CMS_API_PREFIX}/getImage.png?image=`;

const defaultState = {
  skill: {
    name: '',
    file: null,
    category: null,
    language: '',
    image: avatarsIcon,
    imageUrl: '<image_name>',
    code:
      '::name <Bot_name>\n::category <Category>\n::language <Language>\n::author <author_name>\n::author_url <author_url>\n::description <description> \n::dynamic_content <Yes/No>\n::developer_privacy_policy <link>\n::image images/<image_name>\n::terms_of_use <link>\n\n\nUser query1|query2|quer3....\n!example:<The question that should be shown in public skill displays>\n!expect:<The answer expected for the above example>\nAnswer for the user query',
    author: '',
  },
  design: {
    botbuilderBackgroundBody: '#ffffff',
    botbuilderBodyBackgroundImg: '',
    botbuilderUserMessageBackground: '#0077e5',
    botbuilderUserMessageTextColor: '#ffffff',
    botbuilderBotMessageBackground: '#f8f8f8',
    botbuilderBotMessageTextColor: '#455a64',
    botbuilderIconColor: '#000000',
    botbuilderIconImg: botIcon,
    code:
      '::bodyBackground #ffffff\n::bodyBackgroundImage \n::userMessageBoxBackground #0077e5\n::userMessageTextColor #ffffff\n::botMessageBoxBackground #f8f8f8\n::botMessageTextColor #455a64\n::botIconColor #000000\n::botIconImage ',
  },
  configCode:
    "::allow_bot_only_on_own_sites no\n!Write all the domains below separated by commas on which you want to enable your chatbot\n::allowed_sites \n!Choose if you want to enable the default susi skills or not\n::enable_default_skills yes\n!Choose if you want to enable chatbot in your devices or not\n::enable_bot_in_my_devices no\n!Choose if you want to enable chatbot in other user's devices or not\n::enable_bot_for_other_users no",
  view: 'code',
  loading: true,
};

const generateDesignData = code => {
  const bodyBackgroundMatch = code.match(/^::bodyBackground\s(.*)$/m);
  const bodyBackgroundImageMatch = code.match(/^::bodyBackgroundImage\s(.*)$/m);
  const userMessageBoxBackgroundMatch = code.match(
    /^::userMessageBoxBackground\s(.*)$/m,
  );
  const userMessageTextColorMatch = code.match(
    /^::userMessageTextColor\s(.*)$/m,
  );
  const botMessageBoxBackgroundMatch = code.match(
    /^::botMessageBoxBackground\s(.*)$/m,
  );
  const botMessageTextColorMatch = code.match(/^::botMessageTextColor\s(.*)$/m);
  const botIconColorMatch = code.match(/^::botIconColor\s(.*)$/m);
  const botIconImageMatch = code.match(/^::botIconImage\s(.*)$/m);
  let designData = {};
  if (bodyBackgroundMatch) {
    designData.botbuilderBackgroundBody = bodyBackgroundMatch[1];
  }
  if (bodyBackgroundImageMatch) {
    designData.botbuilderBodyBackgroundImg = bodyBackgroundImageMatch[1];
  }
  if (userMessageBoxBackgroundMatch) {
    designData.botbuilderUserMessageBackground =
      userMessageBoxBackgroundMatch[1];
  }
  if (userMessageTextColorMatch) {
    designData.botbuilderUserMessageTextColor = userMessageTextColorMatch[1];
  }
  if (botMessageBoxBackgroundMatch) {
    designData.botbuilderBotMessageBackground = botMessageBoxBackgroundMatch[1];
  }
  if (botMessageTextColorMatch) {
    designData.botbuilderBotMessageTextColor = botMessageTextColorMatch[1];
  }
  if (botIconColorMatch) {
    designData.botbuilderIconColor = botIconColorMatch[1];
  }
  if (botIconImageMatch) {
    designData.botbuilderIconImg = botIconImageMatch[1];
  }
  return designData;
};

export default handleActions(
  {
    [actionTypes.CREATE_SET_VIEW](state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    [actionTypes.CREATE_SET_SKILL_DATA](state, { payload }) {
      return {
        ...state,
        skill: {
          ...state.skill,
          ...payload,
        },
      };
    },
    [actionTypes.CREATE_GET_SKILL_CODE](state, { payload }) {
      const { text: code } = payload;
      const match = code.match(/^::image\s(.*)$/m);

      let image = `${urls.API_URL}/cms/getImage.png?model=general&language=${
        state.skill.language
      }&group=${state.skill.category}&image=${code
        .split('::image')[1]
        .split('::')[0]
        .trim()}`;

      return {
        ...state,
        skill: {
          ...state.skill,
          code,
          imageUrl: match !== null ? match[1] : state.skill.imageUrl,
          image,
        },
      };
    },
    [actionTypes.CREATE_SET_SKILL_CODE](state, { payload }) {
      const { code } = payload;
      return {
        ...state,
        skill: {
          ...state.skill,
          code,
        },
      };
    },
    [actionTypes.CREATE_GET_BOTBUILDER_CODE](state, { payload }) {
      const { text: code } = payload;
      const {
        skill: { language, category, image },
      } = state;
      const buildCode = '::name' + code.split('::name')[1];
      const designCode =
        '::bodyBackground ' +
        code.split('::bodyBackground ')[1].split('::name')[0];
      const configCode =
        '::allow_bot_only_on_own_sites' +
        code
          .split('::allow_bot_only_on_own_sites')[1]
          .split('::bodyBackground')[0];
      const imageNameMatch = buildCode.match(/^::image\s(.*)$/m);
      let imagePreviewUrl;
      const localImages = [
        'images/<image_name>',
        'images/<image_name_event>',
        'images/<image_name_job>',
        'images/<image_name_contact>',
      ];
      if (!localImages.includes(imageNameMatch[1])) {
        imagePreviewUrl =
          urls.API_URL +
          '/cms/getImage.png?access_token=' +
          cookies.get('loggedIn') +
          '&language=' +
          language +
          '&group=' +
          category +
          '&image=' +
          imageNameMatch[1];
      } else if (imageNameMatch[1] === 'images/<image_name_event>') {
        imagePreviewUrl = '/botTemplates/event-registration.jpg';
      } else if (imageNameMatch[1] === 'images/<image_name_job>') {
        imagePreviewUrl = '/botTemplates/job-application.jpg';
      } else if (imageNameMatch[1] === 'images/<image_name_contact>') {
        imagePreviewUrl = '/botTemplates/contact-us.png';
      } else {
        imagePreviewUrl = image;
      }

      return {
        ...state,
        skill: {
          ...state.skill,
          code: buildCode,
          image: imagePreviewUrl,
          imageUrl: imageNameMatch[1],
        },
        design: {
          ...state.design,
          code: designCode,
        },
        configCode,
      };
    },

    [actionTypes.CREATE_SET_DESIGN_DATA](state, { payload }) {
      const { code } = payload;
      return {
        ...state,
        design: {
          code,
          ...generateDesignData(code),
        },
      };
    },
    [actionTypes.CREATE_UPDATE_DESIGN_DATA](state, { payload }) {
      return {
        ...state,
        design: {
          ...state.design,
          ...payload,
        },
      };
    },
    [actionTypes.CREATE_RESET_DESIGN_DATA](state, { payload }) {
      return {
        ...state,
        design: defaultState.design,
      };
    },
    [actionTypes.CREATE_SET_DESIGN_COMPONENT_COLOR](state, { payload }) {
      let code = '';
      const { component, color } = payload;
      if (component === 'botbuilderBackgroundBody') {
        code = state.design.code.replace(
          /^::bodyBackground\s(.*)$/m,
          `::bodyBackground ${color}`,
        );
      } else if (component === 'botbuilderUserMessageBackground') {
        code = state.design.code.replace(
          /^::userMessageBoxBackground\s(.*)$/m,
          `::userMessageBoxBackground ${color}`,
        );
      } else if (component === 'botbuilderUserMessageTextColor') {
        code = state.design.code.replace(
          /^::userMessageTextColor\s(.*)$/m,
          `::userMessageTextColor ${color}`,
        );
      } else if (component === 'botbuilderBotMessageBackground') {
        code = state.design.code.replace(
          /^::botMessageBoxBackground\s(.*)$/m,
          `::botMessageBoxBackground ${color}`,
        );
      } else if (component === 'botbuilderBotMessageTextColor') {
        code = state.design.code.replace(
          /^::botMessageTextColor\s(.*)$/m,
          `::botMessageTextColor ${color}`,
        );
      } else if (component === 'botbuilderIconColor') {
        code = state.design.code.replace(
          /^::botIconColor\s(.*)$/m,
          `::botIconColor ${color}`,
        );
      }
      return {
        ...state,
        design: {
          ...state.design,
          code,
          [component]: color,
        },
      };
    },
    [actionTypes.CREATE_SET_CONFIGURE_DATA](state, { payload }) {
      const { configCode } = payload;
      return {
        ...state,
        configCode,
      };
    },
    [actionTypes.CREATE_GET_SKILL_BY_COMMIT_ID](state, { payload }) {
      const { file: code } = payload;
      const imageUrl = code.match(/^::image\s(.*)$/m)
        ? code.match(/^::image\s(.*)$/m)[1]
        : state.skill.imageUrl;
      return {
        ...state,
        skill: {
          ...state.skill,
          code,
          imageUrl,
        },
      };
    },
    [actionTypes.CREATE_GET_AUTHOR_URL](state, { payload }) {
      if (payload && payload.items && !_.isEmpty(payload.items)) {
        const data = payload.items;
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 'User') {
            let newCode = String(state.skill.code);
            newCode.replace(
              /^::author_url\s(.*)$/m,
              '::author_url ' + data[i].html_url,
            );
            return {
              ...state,
              skill: {
                ...state.skill,
                code: newCode,
              },
            };
          }
        }
      } else {
        return {
          ...state,
        };
      }
    },
    [actionTypes.CREATE_GET_DRAFT_BOT_DETAILS](state, { payload }) {
      if (Object.keys(payload.drafts).length > 0) {
        Object.keys(payload.drafts).forEach(key => {
          const draft = payload.drafts[key];
          const {
            name,
            language,
            group: category,
            buildCode: code,
            configCode,
          } = draft;
          let { designCode } = draft;
          designCode = designCode.replace(
            'bodyBackground ',
            'bodyBackground #',
          );
          designCode = designCode.replace(
            'userMessageBoxBackground ',
            'userMessageBoxBackground #',
          );
          designCode = designCode.replace(
            'userMessageTextColor ',
            'userMessageTextColor #',
          );
          designCode = designCode.replace(
            'botMessageBoxBackground ',
            'botMessageBoxBackground #',
          );
          designCode = designCode.replace(
            'botMessageTextColor ',
            'botMessageTextColor #',
          );
          designCode = designCode.replace('botIconColor ', 'botIconColor #');
          return {
            ...state,
            skill: {
              ...state.skill,
              name,
              language,
              category,
              code,
            },
            design: {
              ...generateDesignData(designCode),
              code: designCode,
            },
            configCode,
          };
        });
      } else {
        return {
          ...state,
        };
      }
    },
    [actionTypes.CREATE_GET_BOT_DETAILS](state, { payload }) {
      let { text } = payload;
      const buildCode = '::name' + text.split('::name')[1];
      const designCode =
        '::bodyBackground ' +
        text.split('::bodyBackground ')[1].split('::name')[0];
      const configCode =
        '::allow_bot_only_on_own_sites' +
        text
          .split('::allow_bot_only_on_own_sites')[1]
          .split('::bodyBackground')[0];
      const imageNameMatch = buildCode.match(/^::image\s(.*)$/m);
      let imagePreviewUrl;
      const localImages = [
        'images/<image_name>',
        'images/<image_name_event>',
        'images/<image_name_job>',
        'images/<image_name_contact>',
      ];
      if (!localImages.includes(imageNameMatch[1])) {
        imagePreviewUrl = `${
          urls.API_URL
        }/cms/getImage.png?access_token=${cookies.get('loggedIn')}&language=${
          state.skill.language
        }&group=${state.skill.category}&image=${imageNameMatch[1]}`;
      } else if (imageNameMatch[1] === 'images/<image_name_event>') {
        imagePreviewUrl = '/botTemplates/event-registration.jpg';
      } else if (imageNameMatch[1] === 'images/<image_name_job>') {
        imagePreviewUrl = '/botTemplates/job-application.jpg';
      } else if (imageNameMatch[1] === 'images/<image_name_contact>') {
        imagePreviewUrl = '/botTemplates/contact-us.png';
      } else {
        imagePreviewUrl = state.skill.image;
      }
      return {
        ...state,
        skill: {
          ...state.skill,
          code: buildCode,
          image: imagePreviewUrl,
          imageUrl: imageNameMatch[1],
        },
        design: {
          ...generateDesignData(designCode),
          code: designCode,
        },
        configCode,
        loading: false,
      };
    },

    [actionTypes.CREATE_SET_BOT_BACKGROUND_IMAGE](state, { payload }) {
      const response = payload;
      const imagePath = { response };
      const botbuilderBodyBackgroundImg = IMAGE_GET_URL + imagePath;
      const botbuilderBodyBackgroundImgName = response.imagePath.substring(
        imagePath.indexOf('_') + 1,
      );
      let code = String(state.skill.code);
      code = code.replace(
        /^::bodyBackgroundImage\s(.*)$/m,
        `::bodyBackgroundImage ${botbuilderBodyBackgroundImg}`,
      );
      return {
        ...state,
        design: {
          ...state.design,
          code,
          botbuilderBodyBackgroundImg,
          botbuilderBodyBackgroundImgName,
        },
      };
    },
    [actionTypes.CREATE_SET_BOT_AVATAR](state, { payload }) {
      const response = payload;
      const imagePath = { response };
      const botbuilderIconImg = IMAGE_GET_URL + imagePath;
      let code = String(state.skill.code);
      code = code.replace(
        /^::botIconImage\s(.*)$/m,
        `::botIconImage ${botbuilderIconImg}`,
      );
      return {
        ...state,
        design: {
          ...state.design,
          code,
          botbuilderIconImg,
        },
      };
    },
    [actionTypes.CREATE_RESET_STORE](state, { payload }) {
      return {
        ...defaultState,
      };
    },
  },
  {
    ...defaultState,
  },
);

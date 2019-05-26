import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../../redux/actions/messages';
import _ from 'lodash';

const styles = {
  feedbackContainer: {
    top: 5,
    display: 'block',
    position: 'relative',
    float: 'right',
  },
  feedbackButton: {
    height: '16px',
    cursor: 'pointer',
  },
};

class Feedback extends React.Component {
  static propTypes = {
    message: PropTypes.object,
    actions: PropTypes.object,
    skillFeedbackByMessageId: PropTypes.object,
    countryCode: PropTypes.string,
    countryName: PropTypes.string,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      feedbackInProgress: false,
      skill: this.parseSkill(),
    };
  }

  parseSkill = () => {
    const { message } = this.props;
    let skillObj = {};
    if (message && message.response && message.authorName === 'SUSI') {
      const skillData = _.get(message, 'response.answers.0.skills.0', '');
      if (skillData) {
        let parsedData = skillData.split('/');
        if (parsedData.length === 7) {
          skillObj.model = parsedData[3];
          skillObj.group = parsedData[4];
          skillObj.language = parsedData[5];
          skillObj.skill = parsedData[6].slice(0, -4);
        }
      }
    }
    return skillObj;
  };

  removeFeedback = () => {
    this.setState({ feedbackInProgress: false });
  };

  postSkillFeedback = feedback => {
    const skillInfo = this.state.skill;
    const { actions, message, countryCode, countryName } = this.props;
    const query = _.get(message, 'response.query', '');
    const reply = _.get(message, 'text', '');

    this.setState({
      feedbackInProgress: true,
    });

    actions
      .postSkillFeedback({
        ...skillInfo,
        feedback,
        query,
        reply,
        countryName,
        countryCode,
      })
      .then(({ payload }) => {
        if (payload.accepted) {
          this.saveSkillFeedback(feedback);
        } else {
          this.removeFeedback();
        }
      })
      .catch(err => {
        this.removeFeedback();
      });
  };

  saveSkillFeedback = feedback => {
    const { actions, message } = this.props;
    actions.saveSkillFeedback({ messageId: message.id, feedback }).then(() => {
      this.setState({
        feedbackInProgress: false,
      });
    });
  };

  render() {
    const { message, skillFeedbackByMessageId, theme } = this.props;
    let feedback = skillFeedbackByMessageId[message.id]
      ? skillFeedbackByMessageId[message.id]
      : '';
    const defaultFeedbackColor = theme === 'light' ? '#90a4ae' : '#7eaaaf';

    return (
      <span>
        {message && message.authorName === 'SUSI' ? (
          <span className="feedback" style={styles.feedbackContainer}>
            <ThumbUp
              onClick={() => this.postSkillFeedback('positive')}
              style={styles.feedbackButton}
              color={feedback === 'positive' ? '#00ff7f' : defaultFeedbackColor}
            />
            <ThumbDown
              onClick={() => this.postSkillFeedback('negative')}
              style={styles.feedbackButton}
              color={feedback === 'negative' ? '#f23e3e' : defaultFeedbackColor}
            />
          </span>
        ) : null}
      </span>
    );
  }
}

function mapStateToProps({ messages, app, settings }) {
  return {
    skillFeedbackByMessageId: messages.skillFeedbackByMessageId,
    countryCode: _.get(app, 'location.countryCode', ''),
    countryName: _.get(app, 'location.countryName', ''),
    theme: settings.theme,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feedback);

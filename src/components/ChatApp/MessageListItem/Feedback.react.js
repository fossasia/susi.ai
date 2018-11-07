import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import ShareIcon from 'material-ui/svg-icons/social/share';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';
import $ from 'jquery';

const styles = {
  feedbackStyle: {
    top: 5,
    display: 'block',
    position: 'relative',
    float: 'right',
  },
  feedbackIndicator: {
    height: '16px',
    cursor: 'pointer',
  },
  indicatorStyleShare: {
    height: '13px',
    cursor: 'pointer',
  },
};

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingGiven: false,
      positive: false,
      negative: false,
      skill: this.parseSkill(),
    };
  }

  parseSkill = () => {
    const { message } = this.props;
    let rating = {};
    if (message && message.response && message.authorName === 'SUSI') {
      if (message.response.answers[0].skills !== undefined) {
        let skill = message.response.answers[0].skills[0];
        let parsed = skill.split('/');
        if (parsed.length === 7) {
          rating.model = parsed[3];
          rating.group = parsed[4];
          rating.language = parsed[5];
          rating.skill = parsed[6].slice(0, -4);
        }
      } else {
        return null;
      }
    }
    return rating;
  };

  removeFeedback() {
    this.setState({
      ratingGiven: false,
      positive: false,
      negative: false,
    });
  }

  // Update state to store rating
  rateSkill = rating => {
    const defaults = UserPreferencesStore.getPreferences();
    const BASE_URL = defaults.Server;
    const { skill, positive, negative } = this.state;

    switch (rating) {
      case 'positive': {
        this.setState({
          ratingGiven: true,
          positive: !positive,
          negative: false,
        });
        break;
      }
      case 'negative': {
        this.setState({
          ratingGiven: true,
          positive: false,
          negative: !negative,
        });
        break;
      }
      default: {
        this.removeFeedback();
      }
    }

    const rateEndPoint = `${BASE_URL}/cms/rateSkill.json?model=${
      skill.model
    }&group=${skill.group}&language=${skill.language}&skill=${
      skill.skill
    }&rating=${rating}`;

    $.ajax({
      url: rateEndPoint,
      dataType: 'jsonp',
      jsonpCallback: 'p',
      jsonp: 'callback',
      crossDomain: true,
      success: response => {
        if (response.accepted) {
          console.log('Skill rated successfully');
        } else {
          console.log('Skill rating failed. Try Again');
          this.removeFeedback();
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        let jsonValue = jqXHR.status;
        if (jsonValue === 404) {
          console.log('Skill rating failed. Try Again');
        } else {
          console.log('Some error occurred. Try Again');
        }
        if (textStatus === 'timeout') {
          console.log('Please check your internet connection');
        }
        this.removeFeedback();
      },
    });

    let feedback = skill;
    if (
      !(Object.keys(feedback).length === 0 && feedback.constructor === Object)
    ) {
      feedback.rating = rating;
      Actions.saveFeedback(feedback);
    }
  };

  feedbackButtonsGenerator = () => {
    const { message } = this.props;
    const { positive, negative } = this.state;

    if (message && message.authorName === 'SUSI') {
      const shareMessageSUSI = encodeURIComponent(
        (message.text ? message.text : '').trim(),
      );
      const shareTag = encodeURIComponent(' #SUSI.AI');
      const twitterShare = `https://twitter.com/intent/tweet?text=${shareMessageSUSI}${shareTag}`;

      const feedbackColor =
        UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#7eaaaf';
      let positiveFeedbackColor = feedbackColor;
      let negativeFeedbackColor = feedbackColor;
      if (positive) {
        positiveFeedbackColor =
          UserPreferencesStore.getTheme() === 'light' ? '#1685e5' : '#00ff7f';
      } else if (negative) {
        negativeFeedbackColor =
          UserPreferencesStore.getTheme() === 'light' ? '#d1462f' : '#f23e3e';
      }
      return (
        <span className="feedback" style={styles.feedbackStyle}>
          <ThumbUp
            onClick={() => this.rateSkill('positive')}
            style={styles.feedbackIndicator}
            color={positiveFeedbackColor}
          />
          <ThumbDown
            onClick={() => this.rateSkill('negative')}
            style={styles.feedbackIndicator}
            color={negativeFeedbackColor}
          />
          <ShareIcon
            style={styles.indicatorStyleShare}
            color={
              UserPreferencesStore.getTheme() === 'light'
                ? '#90a4ae'
                : '#7eaaaf'
            }
            onClick={() => window.open(twitterShare, '_blank')}
          />
        </span>
      );
    }
    return null;
  };

  render() {
    return <span>{this.feedbackButtonsGenerator()}</span>;
  }
}

Feedback.propTypes = {
  message: PropTypes.object,
};

export default Feedback;

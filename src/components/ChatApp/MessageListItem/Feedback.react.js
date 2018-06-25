import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import ShareIcon from 'material-ui/svg-icons/social/share';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';
import $ from 'jquery';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Feedback extends React.Component {
  // Parse skill meta data
  parseSkill = () => {
    let message = this.props.message;
    let rating = {};
    if (message.response !== undefined && message.response !== '') {
      if (message.authorName === 'SUSI') {
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
    }
    return rating;
  };

  constructor(props) {
    super(props);
    this.state = {
      ratingGiven: false,
      positive: false,
      negative: false,
      skill: this.parseSkill(),
    };
  }

  // Update state to store rating
  rateSkill = rating => {
    let defaults = UserPreferencesStore.getPreferences();
    let BASE_URL = defaults.Server;
    let skill = this.state.skill;

    let rateEndPoint =
      BASE_URL +
      '/cms/rateSkill.json?model=' +
      skill.model +
      '&group=' +
      skill.group +
      '&language=' +
      skill.language +
      '&skill=' +
      skill.skill +
      '&rating=' +
      rating;

    $.ajax({
      url: rateEndPoint,
      dataType: 'jsonp',
      jsonpCallback: 'p',
      jsonp: 'callback',
      crossDomain: true,
      success: function(response) {
        if (response.accepted) {
          console.log('Skill rated successfully');
        } else {
          console.log('Skill rating failed. Try Again');
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        let jsonValue = jqXHR.status;
        if (jsonValue === 404) {
          console.log('Skill rating failed. Try Again');
        } else {
          console.log('Some error occurred. Try Again');
        }
        if (status === 'timeout') {
          console.log('Please check your internet connection');
        }
      },
    });

    switch (rating) {
      case 'positive': {
        this.setState({
          ratingGiven: true,
          positive: !this.state.positive,
          negative: false,
        });
        break;
      }
      case 'negative': {
        this.setState({
          ratingGiven: true,
          positive: false,
          negative: !this.state.negative,
        });
        break;
      }
      default: {
        this.setState({
          ratingGiven: false,
          positive: false,
          negative: false,
        });
      }
    }
    let feedback = this.state.skill;
    // Send feedback to server
    if (
      !(Object.keys(feedback).length === 0 && feedback.constructor === Object)
    ) {
      feedback.rating = rating;
      this.props.message.feedback.rating = rating;
      Actions.saveFeedback(feedback);
    }
  };

  render() {
    let message = this.props.message;

    let feedbackButtons = null;
    let feedbackStyle = {
      top: 5,
      display: 'flex',
      position: 'relative',
      float: 'right',
    };

    if (message.authorName === 'SUSI') {
      let feedbackIndicator = {
        height: '16px',
        cursor: 'pointer',
      };

      let shareMessageSUSI = message.text === undefined ? '' : message.text;
      shareMessageSUSI = encodeURIComponent(shareMessageSUSI.trim());
      let shareTag = ' #SUSI.AI';
      shareTag = encodeURIComponent(shareTag);
      let twitterShare =
        'https://twitter.com/intent/tweet?text=' + shareMessageSUSI + shareTag;
      let indicatorStyleShare = {
        height: '13px',
        cursor: 'pointer',
      };

      let feedbackColor =
        UserPreferencesStore.getTheme() === 'light' ? '#90a4ae' : '#7eaaaf';
      let positiveFeedbackColor = feedbackColor;
      let negativeFeedbackColor = feedbackColor;
      if (this.state.positive) {
        positiveFeedbackColor =
          UserPreferencesStore.getTheme() === 'light' ? '#1685e5' : '#00ff7f';
      } else if (this.state.negative) {
        negativeFeedbackColor =
          UserPreferencesStore.getTheme() === 'light' ? '#d1462f' : '#f23e3e';
      }

      feedbackButtons = (
        <span className="feedback" style={feedbackStyle}>
          {cookies.get('loggedIn') ? (
            <div>
              <ThumbUp
                onClick={this.rateSkill.bind(this, 'positive')}
                style={feedbackIndicator}
                color={positiveFeedbackColor}
              />
              <ThumbDown
                onClick={this.rateSkill.bind(this, 'negative')}
                style={feedbackIndicator}
                color={negativeFeedbackColor}
              />
            </div>
          ) : (
            ''
          )}
          <ShareIcon
            style={indicatorStyleShare}
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
    if (message.authorName === 'You') {
      feedbackStyle = {};
    }
    return <span>{feedbackButtons}</span>;
  }
}

Feedback.propTypes = {
  message: PropTypes.object,
};

export default Feedback;

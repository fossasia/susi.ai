import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';

class Feedback extends React.Component {

	constructor(props){
		super(props);
	    this.state = {
	    	ratingGiven: false,
	    	positive: false,
	    	negative: false,
	    	skill: this.parseSkill()
	    }
	}

	parseSkill = () => {
		let message = this.props.message;
		let rating ={};
		if(message.authorName === 'SUSI'){
			let skill = message.response.answers[0].skills[0];
			let parsed = skill.split('/');
			if(parsed.length === 7){
				rating.model = parsed[3];
				rating.group = parsed[4];
				rating.language = parsed[5];
				rating.skill = parsed[6].slice(0,-4);
			}
		}
		return rating;
	}

	rateSkill = (rating) => {
		console.log(rating);
		switch(rating){
			case 'positive':{
				this.setState({
					ratingGiven: true,
					positive: true,
					negative: false,
				});
				break;
			}
			case 'negative':{
				this.setState({
					ratingGiven: true,
					positive: false,
					negative: true,
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
		if(!(Object.keys(feedback).length === 0 && feedback.constructor === Object)){
			feedback.rating = rating;
			Actions.saveFeedback(feedback);
		}
	}

	render(){
		let message = this.props.message;

		let feedbackButtons = null;
		let feedbackStyle = {
			display:'block',
			position: 'relative',
			float: 'right'
		}

		if(message.authorName === 'SUSI'){
			let feedbackIndicator = {
				height:'16px',
				cursor: 'pointer'
			}

			let feedbackColor = UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf';
			let positiveFeedbackColor = feedbackColor;
			let negativeFeedbackColor = feedbackColor;
			if(this.state.positive){
				positiveFeedbackColor = UserPreferencesStore.getTheme()==='light' ? '#0000ff' : '#00ff7f';
			}
			else if(this.state.negative){
				negativeFeedbackColor = UserPreferencesStore.getTheme()==='light' ? '#0000ff' : '#00ff7f';
			}

				feedbackButtons = (
					<span className='message-time' style={feedbackStyle}>
						<ThumbUp
							onClick={this.rateSkill.bind(this,'positive')}
							style={feedbackIndicator}
							color={positiveFeedbackColor}/>
						<ThumbDown
							onClick={this.rateSkill.bind(this,'negative')}
							style={feedbackIndicator}
							color={negativeFeedbackColor}/>
					</span>
				);
		}
		if(message.authorName === 'You'){
			feedbackStyle = {};
		}
		return(
			<span>
				{feedbackButtons}
			</span>
		);
	}
}

Feedback.propTypes = {
  message: PropTypes.object,
  latestSUSIMsgID: PropTypes.string
};

export default Feedback;

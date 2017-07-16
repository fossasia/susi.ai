import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';

let originalPositiveCount;
let originalNegativeCount;

class Feedback extends React.Component {

	constructor(props){
		super(props);
		originalPositiveCount = this.props.message.positiveFeedback;
		originalNegativeCount = this.props.message.negativeFeedback;

	    this.state = {
	    	ratingGiven: false,
	    	positive: false,
	    	negative: false,
	    	skill: this.parseSkill(),
				positiveCount: originalPositiveCount,
				negativeCount: originalNegativeCount
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
					positiveCount: parseInt(originalPositiveCount,10)+1,
					ratingGiven: true,
					positive: true,
					negative: false,
				});
				break;
			}
			case 'negative':{
				this.setState({
					negativeCount: parseInt(originalNegativeCount,10)+1,
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
		if( this.state.positive && this.state.positiveCount !== originalPositiveCount) {
				this.setState({positiveCount: parseInt(this.props.message.positiveFeedback,10)});
		}
		if( this.state.negative && this.state.negativeCount !== originalNegativeCount) {
				this.setState({negativeCount: parseInt(this.props.message.negativeFeedback,10)});
		}
		let feedback = this.state.skill;
		if(!(Object.keys(feedback).length === 0 && feedback.constructor === Object)){
			feedback.rating = rating;
			Actions.saveFeedback(feedback);
		}
	}

	render(){
		let message = this.props.message;
		let latestSUSIMsgID = this.props.latestSUSIMsgID;

		let feedbackButtons = null;
		let feedbackStyle = {
			display: (this.state.positiveCount >= 0)?'block':'none',
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

			if(message.id === latestSUSIMsgID){
				feedbackButtons = (
					<li className='message-time' style={feedbackStyle}>
						<ThumbUp
							onClick={this.rateSkill.bind(this,'positive')}
							style={feedbackIndicator}
							color={positiveFeedbackColor}/>
						<span>{this.state.positiveCount}</span>
						<ThumbDown
							onClick={this.rateSkill.bind(this,'negative')}
							style={feedbackIndicator}
							color={negativeFeedbackColor}/>
						<span>{this.state.negativeCount}</span>
					</li>
				);
			}
		}
		if(message.authorName === 'You'){
			feedbackStyle = {};
		}
		return(
			<div>
				{feedbackButtons}
			</div>
		);
	}
}

Feedback.propTypes = {
  message: PropTypes.object,
  latestSUSIMsgID: PropTypes.string
};

export default Feedback;

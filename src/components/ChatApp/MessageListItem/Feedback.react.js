import React from 'react';
import PropTypes from 'prop-types';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import ShareIcon from 'material-ui/svg-icons/social/share';
import UserPreferencesStore from '../../../stores/UserPreferencesStore';
import * as Actions from '../../../actions/';

class Feedback extends React.Component {

	// Parse skill meta data
	parseSkill = () => {
		let message = this.props.message;
		let rating ={};
		if(message.response=== undefined || message.response===''){
		if(message.authorName === 'SUSI'){
			if(message.response.answers[0].skills!==undefined){
				let skill = message.response.answers[0].skills[0];
				let parsed = skill.split('/');
				if(parsed.length === 7){
					rating.model = parsed[3];
					rating.group = parsed[4];
					rating.language = parsed[5];
					rating.skill = parsed[6].slice(0,-4);
				}
			}
			else {
				return null
			}
		}
		}
		return rating;
	}

	constructor(props){
		super(props);
	    this.state = {
	    	ratingGiven: false,
	    	positive: false,
	    	negative: false,
	    	skill: this.parseSkill()
	    }
	}

	// Update state to store rating
	rateSkill = (rating) => {
		switch(rating){
			case 'positive':{
				this.setState({
					ratingGiven: true,
					positive: !this.state.positive,
					negative: false,
				});
				break;
			}
			case 'negative':{
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
		if(!(Object.keys(feedback).length === 0 && feedback.constructor === Object)){
			feedback.rating = rating;
			this.props.message.feedback.rating = rating;
			Actions.saveFeedback(feedback);
		}
	}

	render(){
		let message = this.props.message;

		let feedbackButtons = null;
		let feedbackStyle = {
			top: 5,
			display:'block',
			position: 'relative',
			float: 'right'
		}

		if(message.authorName === 'SUSI'){
			let feedbackIndicator = {
				height:'16px',
				cursor: 'pointer'
			}

			let shareMessageSUSI = message.text;
	    shareMessageSUSI = encodeURIComponent(shareMessageSUSI.trim());
			let shareTag = ' #SUSI.AI';
			shareTag = encodeURIComponent(shareTag);
	    let twitterShare = 'https://twitter.com/intent/tweet?text='+shareMessageSUSI+shareTag;
			let indicatorStyleShare = {
	      height:'13px',
	      cursor:'pointer'
	    }

			let feedbackColor = UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf';
			let positiveFeedbackColor = feedbackColor;
			let negativeFeedbackColor = feedbackColor;
			if(this.state.positive){
				positiveFeedbackColor = UserPreferencesStore.getTheme()==='light' ? '#1685e5' : '#00ff7f';
			}
			else if(this.state.negative){
				negativeFeedbackColor = UserPreferencesStore.getTheme()==='light' ? '#d1462f' : '#f23e3e';
			}

				feedbackButtons = (

					<span className='feedback' style={feedbackStyle}>

						<ThumbUp
							onClick={this.rateSkill.bind(this,'positive')}
							style={feedbackIndicator}
							color={positiveFeedbackColor}/>
						<ThumbDown
							onClick={this.rateSkill.bind(this,'negative')}
							style={feedbackIndicator}
							color={negativeFeedbackColor}/>
						<ShareIcon style={indicatorStyleShare}
		          color={UserPreferencesStore.getTheme()==='light' ? '#90a4ae' : '#7eaaaf'}
		          onClick={()=> window.open(twitterShare, '_blank')}/>
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
};

export default Feedback;
